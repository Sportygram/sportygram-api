import { matchPredictionRepo, matchRepo } from "../../repos";
import { UpdatePrediction } from "./updatePrediction";

export const updatePrediction = new UpdatePrediction(
    matchPredictionRepo,
    matchRepo
);
