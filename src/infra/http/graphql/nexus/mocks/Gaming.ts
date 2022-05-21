import { NexusGenObjects } from "../../nexus-typegen";
import { v4 as uuid } from "uuid";

type Game = NexusGenObjects["Game"];
type GamePlayer = NexusGenObjects["GamePlayer"];

// let playerDefault: GamePlayer = {
//     playerId: uuid(),
//     username: "olucurious",
//     score: Math.floor(Math.random() * 100),
// };

function getPlayerMock(p?: Partial<GamePlayer>): GamePlayer {
    const score = Math.floor(Math.random() * 100);
    return {
        username: "olucurious",
        playerId: uuid(),
        score,
        ...p,
    };
};

let userDefault: Game = {
    gameId: uuid(),
    roomId: uuid(),
    name: "Wethepoppers' Weekly Game",
    description: "",
    gameType: "WEEKLY",
    leaderBoard: [
        getPlayerMock(),
        getPlayerMock({ username: "204070" }),
        getPlayerMock({ username: "tomiwalker" }),
    ],
    data: {},
    createdAt: "2022-05-19T01:45:57.686Z",
    updatedAt: "2022-05-19T01:45:57.686Z",
    expiringAt: "2022-05-26T01:45:57.686Z",
};

export const getGameMock = (p?: Partial<Game>): Game => ({
    ...userDefault,
    gameId: uuid(),
    ...p,
});
