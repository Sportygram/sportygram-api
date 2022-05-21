import { matchSocketHandler } from "../../modules/fixtures/infra/match.socket";
import { httpServer } from "../http/app";
const { Server } = require("socket.io");

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// TODO: Use Authentication Middleware
export const matchNamespace = io.of("/match");

matchNamespace.on("connection", matchSocketHandler);
