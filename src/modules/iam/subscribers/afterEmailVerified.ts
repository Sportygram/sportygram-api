// import { User } from '../../iam/domain/user';
import { IHandle } from "../../../lib/domain/events/IHandle";
import {
    DomainEvents,
    RegisterCallback,
} from "../../../lib/domain/events/DomainEvents";
import logger from "../../../lib/core/Logger";
import { EmailVerified } from "../domain/events/emailVerified";
import { AssignRoleToUser } from "../useCases/assignRoleToUser/assignRoleToUser";
import { SystemRequestUser } from "../../../lib/utils/permissions";
import { RemoveUserFromRole } from "../useCases/removeUserFromRole/removeUserFromRole";
import { config } from "../../../lib/config";

export class AfterEmailVerified implements IHandle<EmailVerified> {
    constructor(
        private assignRoleToUser: AssignRoleToUser,
        private removeUserFromRole: RemoveUserFromRole
    ) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        // Register to the domain event
        DomainEvents.register(
            this.onEmailVerified.bind(this) as RegisterCallback,
            EmailVerified.name
        );
    }

    private async onEmailVerified(event: EmailVerified): Promise<void> {
        const { user } = event;
        const sgramConfig: any = config.sportygram;
        const defaultRoleId: string = sgramConfig?.defaultUserRole;
        const verifiedUserRole: string = sgramConfig?.verifiedUserRole;

        try {
            await Promise.all([
                this.assignRoleToUser.execute({
                    userId: user.userId.id.toString(),
                    roleName: verifiedUserRole,
                    requestUser: SystemRequestUser,
                }),

                this.removeUserFromRole.execute({
                    userId: user.userId.id.toString(),
                    roleName: defaultRoleId,
                    requestUser: SystemRequestUser,
                }),
            ]);

            logger.info(
                `[AfterEmailVerified]: Successfully re-assigned user role after EmailVerified`,
                { userId: user.userId, email: user.email }
            );
        } catch (err) {
            logger.error(
                `[AfterEmailVerified]: Failed to re-assigned user role after EmailVerified.`,
                { userId: user.userId, email: user.email }
            );
        }
    }
}
