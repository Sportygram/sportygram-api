import { createChatUser } from "../useCases/createChatUser";
import { AfterUserCreated } from "./afterUserCreated";

new AfterUserCreated(createChatUser)