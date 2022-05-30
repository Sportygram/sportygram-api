import { RefreshAccessToken } from "./RefreshAccessToken";
import { userRepo } from "../../repos";
import { RefreshAccessTokenController } from "./RefreshAccessTokenController";
import { authService } from "../../services";

const refreshAccessToken = new RefreshAccessToken(userRepo, authService);

const refreshAccessTokenController = new RefreshAccessTokenController(
    refreshAccessToken
);

export { refreshAccessToken, refreshAccessTokenController };
