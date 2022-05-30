export enum UserPermission {
    Me = "me",
    System = "system",
    ReadUserProfile = "read:user_profile",
    EditUserProfile = "edit:user_profile",
}

export const UsersPermissionRecord: Partial<Record<UserPermission, string>> = {
    [UserPermission.ReadUserProfile]:
        "Allows a User read another user's profile",
    [UserPermission.EditUserProfile]:
        "Allows a User edit another user's profile",
};
