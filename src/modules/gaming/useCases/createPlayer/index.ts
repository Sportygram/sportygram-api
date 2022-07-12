import { gameRepo, playerRepo } from "../../repos";
import { CreatePlayer } from "./createPlayer";

export const createPlayer = new CreatePlayer(playerRepo, gameRepo);
