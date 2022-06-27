import { matchRepo } from "../../repos";
import { apiFootballService } from "../../services/footballService";
import { UpdateApiFootballLiveMatches } from "./updateApiFootballLive";

export const updateApiFootballLive = new UpdateApiFootballLiveMatches(
    matchRepo,
    apiFootballService
);
