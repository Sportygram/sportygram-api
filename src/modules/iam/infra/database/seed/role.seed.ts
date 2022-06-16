import {
    huddleAdminRoleProp,
    unverifiedEmailUserRoleProp,
    userRoleProp,
} from "../../../mocks/role.mock";

export const roleSeed = [
    {
        ...userRoleProp,
    },
    {
        ...unverifiedEmailUserRoleProp,
    },
    {
        ...huddleAdminRoleProp,
    },
];

export const rolePermissionsSeed = [
    {
        permissionId: "74c25f47-c856-4d7e-92ac-9903360884ee",
        roleId: huddleAdminRoleProp.id,
    },
    {
        permissionId: "7c5d3165-0429-4693-97ac-d54647e42250",
        roleId: huddleAdminRoleProp.id,
    },
    {
        permissionId: "95395447-b357-435c-8aeb-e8e8092a312e",
        roleId: huddleAdminRoleProp.id,
    },
    {
        permissionId: "9ad833a4-e7d2-47c7-af96-ca15644ba1da",
        roleId: huddleAdminRoleProp.id,
    },
    {
        permissionId: "9e07b528-40a2-47f8-b024-a352d82bc55d",
        roleId: huddleAdminRoleProp.id,
    },
    {
        permissionId: "d4256d8f-ade6-4d8e-8dac-2e9f8a6a5d35",
        roleId: huddleAdminRoleProp.id,
    },
];
