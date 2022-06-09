import { chatUserRepo } from "../../repos";
import { streamService } from "../../services/getStream";
import { CreateChatUser } from "./createChatUser";

export const createChatUser = new CreateChatUser(chatUserRepo, streamService);
