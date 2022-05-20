import { UserInputError } from "apollo-server-errors";
import {
    arg,
    enumType,
    extendType,
    inputObjectType,
    nonNull,
    objectType,
} from "nexus";

export const GameType = enumType({
    name: "GameType",
    members: ["DAILY", "WEEKLY", "SEASON"],
});

export const GamePlayer = objectType({
    name: "GamePlayer",
    definition(t) {
        t.nonNull.id("playerId");
        t.nonNull.string("username");
        t.nonNull.float("score");
    },
});

export const Game = objectType({
    name: "Game",
    definition(t) {
        t.nonNull.id("gameId");
        t.nonNull.id("roomId");
        t.nonNull.string("name");
        t.string("description");
        t.nonNull.field("gameType", { type: "GameType" });
        t.nonNull.list.field("leaderBoard", { type: "GamePlayer" });
        t.nonNull.json("data");
        t.dateTime("createdAt");
        t.dateTime("updatedAt");
        t.dateTime("expiringAt");
    },
});

export const Prediction = objectType({
    name: "Prediction",
    definition(t) {
        t.nonNull.id("predictionId");
        t.nonNull.string("fixtureId");
        t.nonNull.string("predictionType");
        t.nonNull.json("prediction");
    },
});

export const PredictionInput = inputObjectType({
    name: "PredictionInput",
    definition(t) {
        t.string("predictionId");
        t.nonNull.string("fixtureId");
        t.nonNull.string("predictionType");
        t.nonNull.json("prediction");
    },
});

export const PredictionOutput = objectType({
    name: "PredictionOutput",
    definition(t) {
        t.implements("MutationOutput");
        t.nonNull.field("prediction", { type: "Prediction" });
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
            async resolve(_parent, args, _context) {
                return {
                    prediction: { ...args.input, predictionId: "Hello" },
                    message: "Match Prediction Saved",
                };
            },
        });

        t.nonNull.field("updatePrediction", {
            type: "PredictionOutput",
            args: {
                input: arg({ type: nonNull(PredictionInput) }),
            },
            async resolve(_parent, args, _context) {
                const predictionId = args.input.predictionId;
                if (!predictionId) {
                    throw new UserInputError("Please enter valid predictionId");
                }

                return {
                    prediction: { ...args.input, predictionId },
                    message: "Match Prediction Updated",
                };
            },
        });
    },
});
