import { IHandle } from "../../../lib/domain/events/IHandle";
import {
    DomainEvents,
    RegisterCallback,
} from "../../../lib/domain/events/DomainEvents";
import logger from "../../../lib/core/Logger";
// import { SystemRequestUser } from "../../../lib/utils/permissions";
import { UpdateReferralDetails } from "../useCases/updateReferralDetails/updateReferralDetails";
import { UserReferred } from "../../iam/domain/events/userReferred";

export class AfterUserReferred implements IHandle<UserReferred> {
    constructor(private updateReferralDetails: UpdateReferralDetails) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        // Register to the domain event
        DomainEvents.register(
            this.onUserReferred.bind(this) as RegisterCallback,
            UserReferred.name
        );
    }

    private async onUserReferred(event: UserReferred): Promise<void> {
        const { user } = event;

        try {
            if (!user.referrerId) throw new Error("User missing referee");
            await Promise.all([
                this.updateReferralDetails.execute({
                    referrerId: user.referrerId.id.toString(),
                    // requestUser: SystemRequestUser,
                }),
            ]);

            logger.info(
                `[AfterUserReferred]: Successfully updated user refeerral details after UserReferred`,
                {
                    userId: user.userId,
                    email: user.email,
                    referrerId: user.referrerId,
                }
            );
        } catch (err) {
            logger.error(
                `[AfterUserReferred]: Failed to updated user referral details after UserReferred.`,
                {
                    userId: user.userId,
                    email: user.email,
                    referrerId: user.referrerId,
                }
            );
        }
    }
}
