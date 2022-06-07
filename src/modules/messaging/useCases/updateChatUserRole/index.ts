import { chatUserRepo, roomRepo } from "../../repos";
import { streamService } from "../../services/getStream";
import { UpdateChatUserRole } from "./updateChatUserRole";

export const updateChatUserRole = new UpdateChatUserRole(
    roomRepo,
    chatUserRepo,
    streamService
);
