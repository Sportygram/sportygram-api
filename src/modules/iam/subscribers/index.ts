import { emailService } from "../../../lib/services/email";
import { assignRoleToUser } from "../useCases/assignRoleToUser";
import { removeUserFromRole } from "../useCases/removeUserFromRole";
import { createFirebaseUserForHuddleUser } from "../useCases/syncFirebaseUser";
import { AfterEmailTokenCreated } from "./afterEmailTokenCreated";
import { AfterEmailVerified } from "./afterEmailVerified";
import { AfterUserCreated } from "./afterUserCreated";

new AfterEmailTokenCreated(emailService);
new AfterEmailVerified(assignRoleToUser, removeUserFromRole);
new AfterUserCreated(createFirebaseUserForHuddleUser);
