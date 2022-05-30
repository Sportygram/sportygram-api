import { permissionRepo } from "../../repos";
import { CreatePermission } from "./createPermission";
import { CreatePermissionController } from "./createPermissionController";

const createPermission = new CreatePermission(permissionRepo);
const createPermissionController = new CreatePermissionController(
    createPermission
);

export { createPermissionController, createPermission };
