import { v4 as uuid } from "uuid";
import { NexusGenObjects } from "../../nexus-typegen";
import { getGameMock } from "./Gaming";

type Room = NexusGenObjects["Room"];
let roomDefault: Room = {
    name: "Wethepoppers",
    id: uuid(),
    roomImageUrl:
        "https://i.pinimg.com/474x/65/25/a0/6525a08f1df98a2e3a545fe2ace4be47.jpg",
    description: "We popping",
    joiningFee: 0,
    roomType: "public",
    games: [
        getGameMock(),
        getGameMock({ gameType: "DAILY", name: "Wethepoppers' Daily Game" }),
        getGameMock({ gameType: "SEASON", name: "Wethepoppers' Season Game" }),
    ],
    createdAt: "2022-05-19T01:45:57.686Z",
    updatedAt: "2022-05-19T01:45:57.686Z",
};

export const getRoomMock = (p?: Partial<Room>): Room => ({
    ...roomDefault,
    ...p,
});
