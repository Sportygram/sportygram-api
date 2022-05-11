import { WatchedList } from "../../../lib/domain/WatchedList";
import { Permission } from "./permission";
import { Role } from "./role";
import { UserPermissions } from "./userPermissions";

export class UserRoles extends WatchedList<Role> {
    private constructor(initialRoles: Role[]) {
        super(initialRoles);
    }

    get permissions(): UserPermissions {
        return UserPermissions.create(
            this.getItems().reduce<Permission[]>((permissions, role) => {
                return permissions.concat(role.permissions.getItems());
            }, [])
        );
    }

    public compareItems(a: Role, b: Role): boolean {
        return a.equals(b);
    }

    public static create(roles: Role[]): UserRoles {
        return new UserRoles(roles ? roles : []);
    }
}
