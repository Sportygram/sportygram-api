import { userRepo, roleRepo } from "../../repos";
import { AssignRoleToUser } from "./assignRoleToUser";
import { AssignRoleToUserController } from "./assignRoleToUserController";

const assignRoleToUser = new AssignRoleToUser(roleRepo, userRepo);
const assignRoleToUserController = new AssignRoleToUserController(
    assignRoleToUser
);

export { assignRoleToUserController, assignRoleToUser };
