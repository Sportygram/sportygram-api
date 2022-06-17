import { FCMTopic } from "../../../../lib/services/firebase";
import { RequestUserDTO } from "../../../../lib/utils/permissions";

export interface UpdateUserFCMTopicsDTO {
    userId: string;
    set?: FCMTopic;
    unset?: FCMTopic;
    requestUser: RequestUserDTO;
}
