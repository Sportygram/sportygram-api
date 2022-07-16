import * as AppError from "../../../../lib/core/AppError";
import { Either, left, Result, right } from "../../../../lib/core/Result";
import { UseCase } from "../../../../lib/core/UseCase";
import { User } from "../../domain/user";
import { UserRepo } from "../../repos/interfaces";
import { FirebaseService } from "../../../../lib/services/firebase";

type Response = Either<AppError.UnexpectedError, Result<User>>;

interface CreateFirebaseUserForHuddleUserDTO {
    user: User;
}

export class CreateFirebaseUserForHuddleUser
    implements UseCase<CreateFirebaseUserForHuddleUserDTO, Promise<Response>>
{
    constructor(
        private userRepo: UserRepo,
        private firebaseService: FirebaseService
    ) {}

    async execute(
        request: CreateFirebaseUserForHuddleUserDTO
    ): Promise<Response> {
        try {
            const { user } = request;

            const firebaseUser = await this.firebaseService.createUser({
                email: user.email.value,
                password: user.passwordHash.value,
            });

            if (!firebaseUser) {
                throw new Error("Firebase user was not created");
            }
            user.updateFirebaseUserData(firebaseUser);

            await this.userRepo.save(user);
            await this.firebaseService.setClaims(firebaseUser.uid, {
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
