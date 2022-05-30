import { UpdateUserProfileDTO } from "./updateUserProfileDTO";
import {
    UserProfileDoesNotExistError,
    UserDoesNotExistError,
} from "./updateUserProfileErrors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UseCase } from "../../../../lib/core/UseCase";
import { Phone } from "../../domain/valueObjects/phone";
import { UserPermission as P } from "../../domain/users.permissions";
import { hasPermissions } from "../../../../lib/utils/permissions";
import { QueryUser, UserReadRepo, UserRepo } from "../../../iam/repos/interfaces";
import { UserProfileRepo } from "../../repos/interfaces";

type Response = Either<
    | UserProfileDoesNotExistError
    | UserDoesNotExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<QueryUser>
>;

export class UpdateUserProfile
    implements UseCase<UpdateUserProfileDTO, Promise<Response>>
{
    private changes: Result<any>[];

    constructor(
        private userRepo: UserRepo,
        private userProfileRepo: UserProfileRepo,
        private userReadRepo: UserReadRepo
    ) {
        this.changes = [];
    }

    public addChange(result: Result<any>): void {
        this.changes.push(result);
    }

    public getCombinedChangesResult(): Result<any> {
        return Result.combine(this.changes);
    }

    @hasPermissions("UpdateUserProfile", [P.Me, P.System, P.EditUserProfile])
    async execute(request: UpdateUserProfileDTO): Promise<Response> {
        const {
            userId,
            username,
            favoriteTeam,
            firstname,
            lastname,
            onboarded,
            phone,
            country,
            profileImageUrl,
        } = request;

        try {
            const user = await this.userRepo.getUserByUserId(userId);
            if (!user) {
                return left(new UserDoesNotExistError(userId));
            }

            const profile = await this.userProfileRepo.getUserProfileByUserId(
                userId
            );
            if (!profile) {
                return left(new UserProfileDoesNotExistError(userId));
            }

            if (username) {
                // TODO: Check if username is avalilable
                this.addChange(user.updateUsername(username));
            }

            if (firstname) {
                this.addChange(user.updateFirstname(firstname));
            }

            if (lastname) {
                this.addChange(user.updateLastname(lastname));
            }

            if (country) {
                this.addChange(user.updateCountry(country));
            }

            if (onboarded) {
                this.addChange(profile.updateOnboarded(onboarded));
            }

            if (favoriteTeam) {
                this.addChange(profile.updateFavoriteTeam(favoriteTeam));
            }

            if (profileImageUrl) {
                this.addChange(profile.updateProfileImageUrl(profileImageUrl));
            }

            if (phone) {
                const phoneOrError = Phone.create(phone);
                if (phoneOrError.isSuccess)
                    this.addChange(
                        profile.updatePhone(phoneOrError.getValue())
                    );
                else return left(new AppError.InputError(phoneOrError.error));
            }

            if (this.getCombinedChangesResult().isSuccess) {
                await this.userProfileRepo.save(profile);
                await this.userRepo.save(user);
            }

            const readUser = await this.userReadRepo.getUserById(
                request.userId
            );

            if (!readUser) throw new Error("user could not be fetched");
            return right(Result.ok<QueryUser>(readUser));
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
