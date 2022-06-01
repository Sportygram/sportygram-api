import { firebaseService } from "../../../../lib/services/firebase";
import { roleRepo, userRepo } from "../../repos";
import { CreateUserWithFirebaseToken } from "./createUserWithFirebaseToken";

export const createUserWithFirebaseToken = new CreateUserWithFirebaseToken(
    userRepo,
    roleRepo,
    firebaseService
);
