import { emailService } from "../../../lib/services/email";
import { assignRoleToUser } from "../useCases/assignRoleToUser";
import { removeUserFromRole } from "../useCases/removeUserFromRole";
import { AfterEmailTokenCreated } from "./afterEmailTokenCreated";
import { AfterEmailVerified } from "./afterEmailVerified";

new AfterEmailTokenCreated(emailService);
new AfterEmailVerified(assignRoleToUser, removeUserFromRole);
