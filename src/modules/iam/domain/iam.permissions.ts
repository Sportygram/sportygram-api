export const IAMPermission = {
    Me: "me",
    System: "system",
    EditPermission: "edit:permission",
    EditRole: `edit:role`,
    EditRoleAssignment: "edit:role_assignment",
    CreateUser: "create:user",
    DeleteUser: "delete:user",
    EditUser: "edit:user",
} as const;
export type IAMPermission = typeof IAMPermission[keyof typeof IAMPermission];

export const IAMPermissionRecord: Partial<Record<IAMPermission, string>> = {
    [IAMPermission.EditPermission]:
        "Allows a User create and update a Permission",
    [IAMPermission.EditRole]: "Allows a User create and update a Role",
    [IAMPermission.EditRoleAssignment]:
        "Allows a User assign / remove a role from a user",
    [IAMPermission.CreateUser]: "Allows a User create a new user account",
    [IAMPermission.DeleteUser]: "Allows a User delete a user account",
    [IAMPermission.EditUser]: "Allows a User edit an existing user account",
};

export default IAMPermissionRecord;
