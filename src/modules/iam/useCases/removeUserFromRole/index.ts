import { userRepo, roleRepo } from "../../repos";
import { RemoveUserFromRole } from "./removeUserFromRole";
import { RemoveUserFromRoleController } from "./removeUserFromRoleController";

const removeUserFromRole = new RemoveUserFromRole(roleRepo, userRepo);
const removeUserFromRoleController = new RemoveUserFromRoleController(
    removeUserFromRole
);

export { removeUserFromRoleController, removeUserFromRole };
