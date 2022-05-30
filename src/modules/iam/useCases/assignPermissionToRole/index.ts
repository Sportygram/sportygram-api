import { permissionRepo, roleRepo } from "../../repos";
import { AssignPermissionToRole } from "./assignPermissionToRole";
import { AssignPermissionToRoleController } from "./assignPermissionToRoleController";

const assignPermissionToRole = new AssignPermissionToRole(
    roleRepo,
    permissionRepo
);
const assignPermissionToRoleController = new AssignPermissionToRoleController(
    assignPermissionToRole
);

export { assignPermissionToRoleController, assignPermissionToRole };
