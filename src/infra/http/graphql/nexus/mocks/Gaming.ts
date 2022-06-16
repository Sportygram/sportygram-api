import { NexusGenObjects } from "../../nexus-typegen";
import { v4 as uuid } from "uuid";

type RoomGame = NexusGenObjects["RoomGame"];
type GamePlayer = NexusGenObjects["GamePlayer"];

// let playerDefault: GamePlayer = {
//     playerId: uuid(),
//     username: "olucurious",
//     displayName: "olucurious",
//     score: Math.floor(Math.random() * 100),
// };

function getPlayerMock(p?: Partial<GamePlayer>): GamePlayer {
    const score = Math.floor(Math.random() * 100);
    const username = p?.username || "olucurious";
    return {
        username,
        displayName: username,
        playerId: uuid(),
        score,
        ...p,
    };
}

let gameDefault: RoomGame = {
    id: uuid(),
    name: "Wethepoppers' Weekly Game",
    description: "",
    roomId: uuid(),
    type: "weekly",
    status: "in_progress",
    leaderBoard: [
        getPlayerMock(),
        getPlayerMock({ username: "204070" }),
        getPlayerMock({ username: "tomiwalker" }),
    ],
    summary: {},
    createdAt: "2022-05-19T01:45:57.686Z",
    updatedAt: "2022-05-19T01:45:57.686Z",
    expiringAt: "2022-05-26T01:45:57.686Z",
};

export const getGameMock = (p?: Partial<RoomGame>): RoomGame => ({
    ...gameDefault,
    id: uuid(),
    ...p,
});
