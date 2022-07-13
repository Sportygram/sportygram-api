import { chatUserRepo } from "../../repos";
import { streamService } from "../../services/getStream";
import { GenerateChatToken } from "./generateChatToken";

export const generateChatToken = new GenerateChatToken(
    chatUserRepo,
    streamService
);
