import { matchRepo } from "../../repos";
import { CreateMatch } from "./createMatch";

export const createMatch = new CreateMatch(matchRepo);
