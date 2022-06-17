import * as AppError from "../../../../lib/core/AppError";
import { Either, left, Result, right } from "../../../../lib/core/Result";
import { UseCase } from "../../../../lib/core/UseCase";
import { UpdateUserFCMTopicsDTO } from "./updateUserFCMTopicsDTO";
import { FirebaseService } from "../../../../lib/services/firebase";
import { UserRepo } from "../../../iam/repos/interfaces";
import {
    FCMTopicUpdateError,
    UserDoesNotExistError,
    UserDoesNotHaveFCMTokenError,
} from "./updateUserFCMTopicsErrors";

type Response = Either<
    | AppError.UnexpectedError
    | UserDoesNotExistError
    | UserDoesNotHaveFCMTokenError
    | FCMTopicUpdateError,
    Result<void>
>;

export class UpdateUserFCMTopics
    implements UseCase<UpdateUserFCMTopicsDTO, Promise<Response>>
{
    constructor(
        private userRepo: UserRepo,
        private firebaseService: FirebaseService
    ) {}

    async execute(request: UpdateUserFCMTopicsDTO): Promise<Response> {
        try {
            const { userId, set, unset } = request;
            const user = await this.userRepo.getUserByUserId(userId);
            if (!user) {
                return left(new UserDoesNotExistError(userId));
            }
            if (!user.metadata.fcm) {
                return left(new UserDoesNotHaveFCMTokenError(userId));
            }

            let fcmTopicUpdated = true;
            if (set) {
                user.addSubscribedFCMTopic(set);
                fcmTopicUpdated =
                    fcmTopicUpdated &&
                    (await this.firebaseService.subscribeDeviceToTopic(
                        user.metadata.fcm.token,
                        set
                    ));
            }
            if (unset) {
                user.removeUnsubscribedFCMTopic(unset);
                fcmTopicUpdated &&
                    (await this.firebaseService.unsubscribeDeviceFromTopic(
                        user.metadata.fcm.token,
                        unset
                    ));
            }

            if (!fcmTopicUpdated)
                return left(new FCMTopicUpdateError(userId, set, unset));

            await this.userRepo.save(user);
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
