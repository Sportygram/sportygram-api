import { roleRepo, userRepo } from "../../repos";
import { CreateUser } from "./createUser";

export const createUser = new CreateUser(userRepo, roleRepo);
