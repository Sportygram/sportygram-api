import { athleteRepo, matchRepo } from "../../repos";
import { apiFootballService } from "../../services/footballService";
import { CompleteFootballMatch } from "./completeFootballMatch";

export const completeFootbalMatch = new CompleteFootballMatch(
    matchRepo,
    apiFootballService,
    athleteRepo
);
