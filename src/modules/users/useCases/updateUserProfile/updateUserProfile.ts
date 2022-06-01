import { UpdateUserProfileDTO } from "./updateUserProfileDTO";
import {
    UserProfileDoesNotExistError,
    UserDoesNotExistError,
} from "./updateUserProfileErrors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UseCase, WithChanges } from "../../../../lib/core/UseCase";
import { Phone } from "../../domain/valueObjects/phone";
import { UserPermission as P } from "../../domain/users.permissions";
import { hasPermissions } from "../../../../lib/utils/permissions";
import {
    QueryUser,
    UserReadRepo,
    UserRepo,
} from "../../../iam/repos/interfaces";
import { UserProfileRepo } from "../../repos/interfaces";

type Response = Either<
    | UserProfileDoesNotExistError
    | UserDoesNotExistError
    | AppError.UnexpectedError
    | AppError.PermissionsError,
    Result<QueryUser>
>;

export class UpdateUserProfile
    extends WithChanges
    implements UseCase<UpdateUserProfileDTO, Promise<Response>>
{
    constructor(
        private userRepo: UserRepo,
        private userProfileRepo: UserProfileRepo,
        private userReadRepo: UserReadRepo
    ) {
        super();
    }

    @hasPermissions("UpdateUserProfile", [P.Me, P.System, P.EditUserProfile])
    async execute(request: UpdateUserProfileDTO): Promise<Response> {
        const changes: Result<any>[] = [];
        const {
            userId,
            username,
            favoriteTeam,
            firstname,
            lastname,
            onboarded,
            phone,
            country,
            profileColour,
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
                this.addChange(user.updateUsername(username), changes);
            }

            if (firstname) {
                this.addChange(user.updateFirstname(firstname), changes);
            }

            if (lastname) {
                this.addChange(user.updateLastname(lastname), changes);
            }

            if (country) {
                this.addChange(user.updateCountry(country), changes);
            }

            if (onboarded) {
                this.addChange(profile.updateOnboarded(onboarded), changes);
            }

            if (favoriteTeam) {
                this.addChange(profile.updateFavoriteTeam(favoriteTeam), changes);
            }

            if (profileColour) {
                this.addChange(profile.updateProfileColour(profileColour), changes);
            }
            if (profileImageUrl) {
                this.addChange(profile.updateProfileImageUrl(profileImageUrl), changes);
            }

            if (phone) {
                const phoneOrError = Phone.create(phone);
                if (phoneOrError.isSuccess)
                    this.addChange(
                        profile.updatePhone(phoneOrError.getValue()), changes
                    );
                else return left(new AppError.InputError(phoneOrError.error));
            }

            const updateOrError = this.getChangesResult(changes);
            if (updateOrError.isFailure) {
                return left(new AppError.InputError(updateOrError.error));
            }

            await this.userProfileRepo.save(profile);
            await this.userRepo.save(user);

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
