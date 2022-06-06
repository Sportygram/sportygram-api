export enum MessagingPermission {
    Me = "me",
    System = "system",
    ReadRoom = "read:room",
    EditRoom = "edit:room",
}

export const UsersPermissionRecord: Partial<
    Record<MessagingPermission, string>
> = {
    [MessagingPermission.ReadRoom]: "Allows a User read a room",
    [MessagingPermission.EditRoom]: "Allows a User edit a room",
};
