import { firebaseService } from "../../../lib/services/firebase";
import { scoreMatchPredictions } from "../useCases/scoreMatchPredictions";
import { AfterLiveMatchUpdated } from "./afterLiveMatchUpdated";
import { AfterMatchQuestionAnswered } from "./afterMatchQuestionAnswered";

new AfterLiveMatchUpdated(firebaseService);
new AfterMatchQuestionAnswered(scoreMatchPredictions);
