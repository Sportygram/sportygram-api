import { matchPredictionRepo, matchRepo, playerRepo } from "../../repos";
import { ScoreMatchPredictions } from "./scoreMatchPredictions";

export const scoreMatchPredictions = new ScoreMatchPredictions(
    matchRepo,
    matchPredictionRepo,
    playerRepo
);
