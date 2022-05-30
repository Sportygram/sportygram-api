import Joi from "joi";
import "reflect-metadata";
import { config } from "../../config";
import { PermissionsError } from "../../core/AppError";
import { left } from "../../core/Result";

// enum UserRole {
//     UnverifiedUser = "unverified_user",
//     FreeCustomer = "free_customer",
//     PremiumCustomer = "premium_customer",
//     OrganizationAdmin = "organization_admin",
//     OrganizationStaff = "organization_staff",
//     Admin = "admin",
//     SuperAdmin = "super_admin",
// }

enum AccessMode {
    Create = "create",
    Read = "read",
    Update = "update",
    Delete = "delete",
    Edit = "edit",
}

enum UserState {
    Active = "active",
    Inactive = "inactive",
    Deleted = "deleted",
}

type JWTClaims = {
    userId: string;
    roles: string[];
    state: string;
};

type RequestUserDTO = {
    userId: string;
    roles: string[];
    state: string;
    permissions: string[];
};

const RequestUserDTOSchema = Joi.object({
    userId: Joi.string().guid(),
    roles: Joi.array().items(Joi.string()),
    state: Joi.string(),
    permissions: Joi.array().items(Joi.string()),
    organizationId: Joi.string().guid(),
});

let sgramOrganizationId = "sgramOrganizationId";

if (process.env.NODE_ENV) {
    const sgramConfig: any = config.sportygram;
    sgramOrganizationId = sgramConfig?.organizationId || "sgramOrganizationId";
}

const SystemRequestUser: RequestUserDTO = {
    userId: sgramOrganizationId,
    roles: ["system"],
    state: "active",
    permissions: ["system"],
};

function hasPermissions(_useCaseName: string, requiredPermissions: string[]) {
    return function (
        target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ): any {
        const executeMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const requestUser: RequestUserDTO = args[0].requestUser;
            if (!requestUser) throw new Error("No Authenticated User");

            if (requestUser.state !== UserState.Active)
                return left(
                    new PermissionsError(
                        target.constructor.name,
                        requestUser?.userId || "SELF"
                    )
                );
            const matchedPermissions = requiredPermissions.filter((p) =>
                requestUser.permissions.includes(p)
            );

            if (!matchedPermissions.length)
                return left(
                    new PermissionsError(
                        target.constructor.name,
                        requestUser?.userId || "SELF"
                    )
                );
            const result = executeMethod.apply(this, args);
            return result;
        };

        return descriptor;
    };
}

export {
    UserState,
    JWTClaims,
    RequestUserDTO,
    RequestUserDTOSchema,
    SystemRequestUser,
    AccessMode,
    hasPermissions,
};
