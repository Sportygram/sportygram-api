import { roleRepo } from "../../repos";
import { CreateRole } from "./createRole";
import { CreateRoleController } from "./createRoleController";

const createRole = new CreateRole(roleRepo);
const createRoleController = new CreateRoleController(createRole);

export { createRoleController, createRole };
