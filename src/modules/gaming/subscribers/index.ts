import { firebaseService } from "../../../lib/services/firebase";
import { createGame } from "../useCases/createGame";
import { createPlayer } from "../useCases/createPlayer";
import { createRoomGames } from "../useCases/createRoomGames";
import { scoreMatchPredictions } from "../useCases/scoreMatchPredictions";
import { AfterGameCompleted } from "./afterGameCompleted";
import { AfterLiveMatchUpdated } from "./afterLiveMatchUpdated";
import { AfterMatchQuestionAnswered } from "./afterMatchQuestionAnswered";
import { AfterRoomCreated } from "./afterRoomCreated";
import { AfterUserCreated } from "./afterUserCreated";

new AfterLiveMatchUpdated(firebaseService);
new AfterMatchQuestionAnswered(scoreMatchPredictions);
new AfterUserCreated(createPlayer);
new AfterGameCompleted(createGame);
new AfterRoomCreated(createRoomGames);
