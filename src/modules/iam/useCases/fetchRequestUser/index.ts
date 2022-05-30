import { userRepo } from "../../repos";
import { authService } from "../../services";
import { FetchRequestUser } from "./fetchRequestUser";

export const fetchRequestUser = new FetchRequestUser(userRepo, authService);
