import { roomRepo } from "../../../messaging/repos";
import { gameRepo, roomGameRepo } from "../../repos";
import { CreateRoomGames } from "./createRoomGames";

export const createRoomGames = new CreateRoomGames(
    roomGameRepo,
    gameRepo,
    roomRepo
);
