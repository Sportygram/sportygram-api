import { roomRepo } from "../../../messaging/repos";
import { gameRepo, playerRepo, roomGameRepo } from "../../repos";
import { CreateGame } from "./createGame";

export const createGame = new CreateGame(
    gameRepo,
    roomRepo,
    roomGameRepo,
    playerRepo
);
