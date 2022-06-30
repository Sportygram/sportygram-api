import { asyncRedisClient } from "../../../../infra/redis";
import { matchRepo } from "../../repos";
import { SetMatchesStartingNowToInProgress } from "./setMatchesStartingNowToInProgress";

export const setMatchesStartingNowToInProgress =
    new SetMatchesStartingNowToInProgress(matchRepo, asyncRedisClient);
