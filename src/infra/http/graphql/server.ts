import { ApolloServer } from "apollo-server-express";
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { Express } from "express";
import { schema } from "./schema";
import { context } from "./context";
import { Server } from "http";

export async function startApolloServer(app: Express, httpServer: Server) {
    const server = new ApolloServer({
        schema,
        context,
        csrfPrevention: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
    });
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    return { server, app };
}
