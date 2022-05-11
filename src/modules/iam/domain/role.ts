import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { RoleCreated } from "./events/roleCreated";
import { Permission } from "./permission";
import { RoleId } from "./roleId";
import { UserPermissions } from "./userPermissions";

interface RoleProps {
    name: string;
    description: string;
    permissions: UserPermissions;
}

export class Role extends AggregateRoot<RoleProps> {
    get roleId(): RoleId {
        return RoleId.create(this._id).getValue();
    }

    get name(): string {
        return this.props.name;
    }
    get description(): string {
        return this.props.description;
    }
    get permissions(): UserPermissions {
        return this.props.permissions;
    }

    public addPermission(permission: Permission) {
        this.permissions.add(permission);
    }

    private constructor(roleProps: RoleProps, id?: UniqueEntityID) {
        super(roleProps, id);
    }

    public static isValidRoleName(roleName: string): boolean {
        return !!roleName.trim() && roleName.split(" ").length === 1;
    }

    public static create(props: RoleProps, id?: UniqueEntityID): Result<Role> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.name, argumentName: "name" },
            { argument: props.description, argumentName: "description" },
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<Role>(guardResult.message || "");
        }
        const lowerCaseName = props.name.toLowerCase();
        const nameValid = this.isValidRoleName(lowerCaseName);
        if (!nameValid)
            return Result.fail<Role>(
                "Invalid name: roleName must be one continous string"
            );

        const role = new Role({ ...props, name: lowerCaseName }, id);
        const isNewRole = !id;

        if (isNewRole) {
            role.addDomainEvent(new RoleCreated(role));
        }
        return Result.ok<Role>(role);
    }
}
