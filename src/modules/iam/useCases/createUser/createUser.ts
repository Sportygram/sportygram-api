import { CreateUserDTO } from "./createUserDTO";
import * as CreateUserErrors from "./createUserErrors";
import { Either, Result, left, right } from "../../../../lib/core/Result";
import * as AppError from "../../../../lib/core/AppError";
import { UserRepo, RoleRepo } from "../../repos/interfaces";
import { UseCase } from "../../../../lib/core/UseCase";
import { UserEmail } from "../../domain/valueObjects/userEmail";
import { UserPassword } from "../../domain/valueObjects/userPassword";
import { User } from "../../domain/user";
import { hasPermissions, UserState } from "../../../../lib/utils/permissions";
import { UserRoles } from "../../domain/userRoles";
import { Token, TokenType } from "../../domain/token";
import { UserTokens } from "../../domain/userTokens";
import { IAMPermission as P } from "../../domain/iam.permissions";
import { ReferralCode } from "../../domain/valueObjects/referralCode";

type Response = Either<
    | CreateUserErrors.EmailAlreadyExistsError
    | AppError.UnexpectedError
    | AppError.PermissionsError
    | AppError.InputError,
    Result<User>
>;

export class CreateUser implements UseCase<CreateUserDTO, Promise<Response>> {
    private userRepo: UserRepo;
    private roleRepo: RoleRepo;

    constructor(userRepo: UserRepo, roleRepo: RoleRepo) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
    }

    @hasPermissions("CreateUser", [P.Me, P.System, P.CreateUser])
    async execute(request: CreateUserDTO): Promise<Response> {
        const {
            firstname,
            lastname,
            role: roleName,
            country,
            requestUser: rawRequestUser,
            sendPasswordResetMail,
            sendVerificationMail,
        } = request;

        // If request user; fetch request user; requestUser is the account creator
        let requestUser: User | undefined;
        const isDefaultUser = rawRequestUser.userId === "me";
        if (!isDefaultUser) {
            requestUser = await this.userRepo.getUserByUserId(
                rawRequestUser.userId
            );

            if (!requestUser)
                return left(
                    new AppError.InputError(
                        `User with id; ${rawRequestUser.userId} does not exist`
                    )
                );
        }

        // Fetch User Role
        const role = await this.roleRepo.getRole(roleName);
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

        //#region Create User Valid Value Objects
        const emailOrError = UserEmail.create(request.email);
        const passwordOrError = UserPassword.create({
            value: request.password,
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

        try {
            const userAlreadyExists = await this.userRepo.getUserByEmail(email);
            if (userAlreadyExists) {
                return left(
                    new CreateUserErrors.EmailAlreadyExistsError(email.value)
                );
            }

            const userOrError: Result<User> = User.create({
                email,
                firstname,
                lastname,
                passwordHash,
                referralCode,
                country: country?.countryCode || country,
                userState: UserState.Active,
                roles,
                tokens: UserTokens.create([]),
                referrerId: referrer?.userId,
            });

            if (userOrError.isFailure && userOrError.error) {
                return left(new AppError.InputError(userOrError.error));
            }

            const user: User = userOrError.getValue();
            if (sendPasswordResetMail) {
                const token = Token.create({
                    type: TokenType.PasswordReset,
                    userId: user.userId,
                }).getValue();

                user.addToken(token);
            }
            if (sendVerificationMail) {
                const token = Token.create({
                    type: TokenType.EmailVerification,
                    userId: user.userId,
                }).getValue();

                user.addToken(token);
            }

            await this.userRepo.save(user);

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
