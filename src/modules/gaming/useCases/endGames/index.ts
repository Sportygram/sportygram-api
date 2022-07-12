import { gameRepo, playerRepo, roomGameRepo } from "../../repos";
import { EndGames } from "./endGames";

export const endGames = new EndGames(gameRepo, roomGameRepo, playerRepo);
