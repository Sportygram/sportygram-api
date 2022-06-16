import { matchPredictionRepo, matchRepo, playerRepo } from "../../repos";
import { MakePrediction } from "./makePrediction";

export const makePrediction = new MakePrediction(
    matchPredictionRepo,
    matchRepo,
    playerRepo
);
