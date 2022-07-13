import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UseCase } from "../../../../lib/core/UseCase";
import { FollowUserDTO } from "./followUser.dto";
import { FollowerRepo, UserProfileRepo } from "../../repos/interfaces";
import { UserProfileDoesNotExistError } from "../updateUserProfile/updateUserProfileErrors";

type Response = Either<
    | UserProfileDoesNotExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<void>
>;

export class FollowUser implements UseCase<FollowUserDTO, Promise<Response>> {
    constructor(
        private followRepo: FollowerRepo,
        private userProfileRepo: UserProfileRepo
    ) {}

    async execute(request: FollowUserDTO): Promise<Response> {
        const { followerId, userId } = request;

        try {
            // TODO: Do not break if user already followed
            const follower = await this.userProfileRepo.getUserProfileByUserId(
                followerId
            );

            if (!follower) {
                return left(new UserProfileDoesNotExistError(followerId));
            }
            const user = await this.userProfileRepo.getUserProfileByUserId(
                userId
            );

            if (!user) {
                return left(new UserProfileDoesNotExistError(userId));
            }

            await this.followRepo.followUser(followerId, userId);

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
