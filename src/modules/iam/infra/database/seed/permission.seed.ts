import { Permission } from "@prisma/client";

const createdAt = new Date();
const updatedAt = new Date();

export const permissionSeed: Permission[] = [
    {
        id: "74c25f47-c856-4d7e-92ac-9903360884ee",
        accessMode: "create",
        description: "Allows a User create a new user account",
        resource: "user",
        createdAt,
        updatedAt,
    },
    {
        id: "7c5d3165-0429-4693-97ac-d54647e42250",
        accessMode: "edit",
        description: "Allows a User create and update a Permission",
        resource: "permission",
        createdAt,
        updatedAt,
    },
    {
        id: "95395447-b357-435c-8aeb-e8e8092a312e",
        accessMode: "edit",
        description: "Allows a User create and update a Role",
        resource: "role",
        createdAt,
        updatedAt,
    },
    {
        id: "9ad833a4-e7d2-47c7-af96-ca15644ba1da",
        accessMode: "edit",
        description: "Allows a User edit an existing user account",
        resource: "user",
        createdAt,
        updatedAt,
    },
    {
        id: "9e07b528-40a2-47f8-b024-a352d82bc55d",
        accessMode: "read",
        description: "Allows a User read another user's profile",
        resource: "user_profile",
        createdAt,
        updatedAt,
    },
    {
        id: "d4256d8f-ade6-4d8e-8dac-2e9f8a6a5d35",
        accessMode: "edit",
        description: "Allows a User assign / remove a role from a user",
        resource: "role_assignment",
        createdAt,
        updatedAt,
    },
];
