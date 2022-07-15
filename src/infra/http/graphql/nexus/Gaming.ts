import {
    arg,
    enumType,
    extendType,
    inputObjectType,
    nonNull,
    objectType,
    stringArg,
} from "nexus";
import { makePredictionResolver } from "../../../../modules/gaming/useCases/makePrediction/makePredictionResolver";
import { unlockPredictionResolver } from "../../../../modules/gaming/useCases/unlockPrediction/unlockPrediction.resolver";
import { updatePredictionResolver } from "../../../../modules/gaming/useCases/updatePrediction/updatePredictionResolver";
import { withUser } from "./utils";

export const GameType = enumType({
    name: "GameType",
    members: ["weekly", "season"],
});

export const GameStatus = enumType({
    name: "GameStatus",
    members: ["completed", "in_progress"],
});

export const RankStatus = enumType({
    name: "RankStatus",
    members: ["up", "same", "down"],
});

export const GamePlayer = objectType({
    name: "GamePlayer",
    definition(t) {
        t.nonNull.id("playerId");
        t.nonNull.string("name");
        t.nonNull.string("username");
        t.nonNull.float("score");
        t.nonNull.int("rank");
        t.nonNull.field("rankStatus", { type: "RankStatus" }); // up, down, same
        t.nonNull.string("profileImageUrl");
    },
});

export const RoomGame = objectType({
    name: "RoomGame",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("name");
        t.string("description");
        t.nonNull.id("roomId");
        t.id("winnerId");
        t.nonNull.field("type", { type: "GameType" });
        t.nonNull.field("status", { type: "GameStatus" });
        t.nonNull.list.field("leaderboard", { type: "GamePlayer" });
        t.nonNull.json("summary");
        t.dateTime("createdAt");
        t.dateTime("updatedAt");
        t.dateTime("expiringAt");
    },
});

export const PredictionOption = objectType({
    name: "PredictionOption",
    definition(t) {
        t.string("value");
        t.string("display");
    },
});

export const Prediction = objectType({
    name: "Prediction",
    definition(t) {
        t.nonNull.string("code");
        t.json("solution"); // any
        t.int("points");
        t.json("value"); // any
    },
});

export const MatchPrediction = objectType({
    name: "MatchPrediction",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("matchId");
        t.boolean("unlocked");
        t.nonNull.list.field("predictions", { type: "Prediction" });
        t.dateTime("createdAt");
        t.dateTime("updatedAt");
    },
});

export const PredictionInput = inputObjectType({
    name: "PredictionInput",
    definition(t) {
        t.nonNull.string("matchId");
        t.json("predictions"); // Record<MatchQuestionCode, any>
    },
});

export const PredictionOutput = objectType({
    name: "PredictionOutput",
    definition(t) {
        t.implements("MutationOutput");
        t.nonNull.field("prediction", { type: "MatchPrediction" });
    },
});

export const GamingMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("predictMatch", {
            type: "PredictionOutput",
            args: {
                input: arg({ type: nonNull(PredictionInput) }),
            },
            resolve: withUser(makePredictionResolver),
        });

        t.nonNull.field("updatePrediction", {
            type: "PredictionOutput",
            args: {
                input: arg({ type: nonNull(PredictionInput) }),
            },
            resolve: withUser(updatePredictionResolver),
        });

        t.nonNull.field("unlockPrediction", {
            type: "PredictionOutput",
            args: {
                predictionId: nonNull(stringArg()),
            },
            resolve: withUser(unlockPredictionResolver),
        });
    },
});
