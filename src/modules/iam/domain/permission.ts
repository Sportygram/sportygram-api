import { Guard } from "../../../lib/core/Guard";
import { Result } from "../../../lib/core/Result";
import { Entity } from "../../../lib/domain/Entity";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { AccessMode } from "../../../lib/utils/permissions";
import { PermissionId } from "./permissionId";

interface PermissionProps {
    accessMode: string;
    resource: string;
    description: string;
}

export class Permission extends Entity<PermissionProps> {
    get permissionId(): PermissionId {
        return PermissionId.create(this._id).getValue();
    }

    get accessMode(): AccessMode {
        return this.props.accessMode as AccessMode;
    }
    get resource(): string {
        return this.props.resource;
    }
    get value(): string {
        return Permission.getPermissionValue(
            this.props.accessMode,
            this.props.resource
        );
    }

    get description(): string {
        return this.props.description;
    }

    private constructor(props: PermissionProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static getPermissionValue(accessMode: string, resource: string) {
        return `${accessMode}:${resource}`;
    }

    public static splitPermissionValue(value: string) {
        const [accessMode, resource] = value.split(":");
        return { accessMode, resource };
    }

    public static create(
        props: PermissionProps,
        id?: UniqueEntityID
    ): Result<Permission> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.accessMode, argumentName: "accessMode" },
            { argument: props.resource, argumentName: "resource" },
            { argument: props.description, argumentName: "description" },
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<Permission>(guardResult.message || "");
        }
        const accessModeGuard = Guard.isValidValueOfEnum(
            props.accessMode,
            AccessMode,
            "accessMode"
        );
        if (!accessModeGuard.succeeded) {
            return Result.fail<Permission>(accessModeGuard.message || "");
        }
        return Result.ok<Permission>(new Permission(props, id));
    }
}
