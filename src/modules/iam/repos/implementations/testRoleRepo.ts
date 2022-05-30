import { Role } from "../../domain/role";
import { RoleRepo } from "../interfaces";

export class TestRoleRepo implements RoleRepo {
    getRoleById(_roleId: string): Promise<Role | undefined> {
        throw new Error("Method not implemented.");
    }
    getRole(_roleName: string): Promise<Role | undefined> {
        throw new Error("Method not implemented.");
    }
    save(_role: Role): Promise<void> {
        throw new Error("Method not implemented.");
    }
}