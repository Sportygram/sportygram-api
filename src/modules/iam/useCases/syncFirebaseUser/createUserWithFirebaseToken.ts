import * as AppError from "../../../../lib/core/AppError";
import { Either, left, Result, right } from "../../../../lib/core/Result";
import { UseCase } from "../../../../lib/core/UseCase";
import { User } from "../../domain/user";
import { UserEmail } from "../../domain/valueObjects/userEmail";
import { UserPassword } from "../../domain/valueObjects/userPassword";
import { RoleRepo, UserRepo } from "../../repos/interfaces";
import { SyncFirebaseUserDTO } from "./syncFirebaseUserDTO";
import { FirebaseService } from "../../../../lib/services/firebase";
import { config } from "../../../../lib/config";
import { ReferralCode } from "../../domain/valueObjects/referralCode";
import { UserRoles } from "../../domain/userRoles";
import { EmailAlreadyExistsError } from "../createUser/createUserErrors";
import { UserState } from "../../../../lib/utils/permissions";
import { UserTokens } from "../../domain/userTokens";

type Response = Either<AppError.UnexpectedError, Result<User>>;

export class CreateUserWithFirebaseToken
    implements UseCase<SyncFirebaseUserDTO, Promise<Response>>
{
    constructor(
        private userRepo: UserRepo,
        private roleRepo: RoleRepo,
        private firebaseService: FirebaseService
    ) {}

    async execute(request: SyncFirebaseUserDTO): Promise<Response> {
        try {
            /*
            https://stackoverflow.com/questions/70170262/synchronize-users-created-with-firebase-auth-to-my-custom-backend
            https://firebase.google.com/docs/auth/admin/custom-claims

                On the client
                    signup / signin
                    getIdToken
                    call a fn that checks claim contain huddle_uuid:
                        if it doesn't call syncFirebaseUser endpoint,
                        on response refresh page and get new claims
                        repeat till claim contains huddle_uuid

                Verify idToken to get claims {uid}
                Get user data with the uid
                Create huddle user, use uid as password
                if successful, set user claims with huddle_uuid

            */
            const { token } = request;
            const firebaseUserRecord =
                await this.firebaseService.getUserFromIdToken(token);
            if (!firebaseUserRecord)
                return left(
                    new AppError.InputError("Error getting user from firebase")
                );
            if (!firebaseUserRecord.email)
                return left(
                    new AppError.InputError(
                        "Firebase User Record does not contain email"
                    )
                );

            //#region Validate DTO
            const role = await this.roleRepo.getRole(
                config.huddle.verifiedUserRole
            );
            if (!role) {
                return left(
                    new AppError.InputError(
                        "Incorrect role, Please check and try again"
                    )
                );
            }

            let referrer: User | undefined;
            if (request.referralCode) {
                referrer = await this.userRepo.getUserByReferralCode(
                    request.referralCode
                );
            }

            const emailOrError = UserEmail.create(firebaseUserRecord?.email);
            const passwordOrError = UserPassword.create({
                value: firebaseUserRecord.uid + firebaseUserRecord.passwordSalt,
            });
            const dtoResult = Result.combine([emailOrError, passwordOrError]);

            if (dtoResult.isFailure) {
                return left(new AppError.InputError(dtoResult.error));
            }
            const email: UserEmail = emailOrError.getValue();
            const passwordHash: UserPassword = passwordOrError.getValue();
            const roles = UserRoles.create([role]);

            let referralCode = ReferralCode.create().getValue();
            let referralCodeAlreadyExist = true;
            while (referralCodeAlreadyExist) {
                referralCode = ReferralCode.create().getValue();
                referralCodeAlreadyExist =
                    !!(await this.userRepo.getUserByReferralCode(
                        referralCode.value
                    ));
            }
            //#endregion

            const userAlreadyExists = await this.userRepo.getUserByEmail(email);
            if (userAlreadyExists) {
                return left(new EmailAlreadyExistsError(email.value));
            }

            const userOrError: Result<User> = User.create({
                email,
                passwordHash,
                referralCode,
                userState: UserState.Active,
                roles,
                tokens: UserTokens.create([]),
                referrerId: referrer?.userId,
                metadata: { firebase: firebaseUserRecord },
            });

            if (userOrError.isFailure && userOrError.error) {
                return left(new AppError.InputError(userOrError.error));
            }

            const user: User = userOrError.getValue();

            await this.userRepo.save(user);
            await this.firebaseService.setClaims(firebaseUserRecord.uid, {
                userId: user.id.toString(),
            });
            return right(Result.ok<User>(user));
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
