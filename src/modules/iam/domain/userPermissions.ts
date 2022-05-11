import { WatchedList } from "../../../lib/domain/WatchedList";
import { Permission } from "./permission";

export class UserPermissions extends WatchedList<Permission> {
    private constructor(initialPermissions: Permission[]) {
        super(initialPermissions);
    }

    public compareItems(a: Permission, b: Permission): boolean {
        return a.equals(b);
    }

    public static create(permissions: Permission[]): UserPermissions {
        return new UserPermissions(permissions ? permissions : []);
    }
}
