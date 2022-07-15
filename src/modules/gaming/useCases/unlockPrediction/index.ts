import { matchPredictionRepo, playerRepo } from "../../repos";
import { UnlockPrediction } from "./unlockPrediction";

export const unlockPrediction = new UnlockPrediction(
    matchPredictionRepo,
    playerRepo
);
