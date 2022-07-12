import * as AppError from "../../../../lib/core/AppError";
import { Either, left, Result, right } from "../../../../lib/core/Result";
import { UseCase } from "../../../../lib/core/UseCase";
import { UpdateReferralDetailsDTO } from "./updateReferralDetails.dto";

import { UserProfileRepo } from "../../repos/interfaces";
import { UserProfileDoesNotExistError } from "../updateUserProfile/updateUserProfileErrors";

type Response = Either<
    AppError.UnexpectedError | UserProfileDoesNotExistError,
    Result<void>
>;

export class UpdateReferralDetails
    implements UseCase<UpdateReferralDetailsDTO, Promise<Response>>
{
    constructor(private userProfileRepo: UserProfileRepo) {}

    async execute(request: UpdateReferralDetailsDTO): Promise<Response> {
        try {
            const { referrerId } = request;
            const profile = await this.userProfileRepo.getUserProfileByUserId(
                referrerId
            );
            if (!profile) {
                return left(new UserProfileDoesNotExistError(referrerId));
            }

            profile.rewardReferral();
            await this.userProfileRepo.save(profile);
            return right(Result.ok());
        } catch (err) {
            return left(
                new AppError.UnexpectedError(
                    err,
                    this.constructor.name,
                    request
                )
            );
        }
    }
}
