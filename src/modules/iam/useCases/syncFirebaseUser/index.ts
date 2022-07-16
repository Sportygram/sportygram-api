import { firebaseService } from "../../../../lib/services/firebase";
import { roleRepo, userRepo } from "../../repos";
import { CreateFirebaseUserForHuddleUser } from "./createFirebaseUserForHuddleUser";
import { CreateUserWithFirebaseToken } from "./createUserWithFirebaseToken";

export const createUserWithFirebaseToken = new CreateUserWithFirebaseToken(
    userRepo,
    roleRepo,
    firebaseService
);

export const createFirebaseUserForHuddleUser =
    new CreateFirebaseUserForHuddleUser(userRepo, firebaseService);
