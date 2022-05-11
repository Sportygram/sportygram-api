import { ApolloServer } from "apollo-server-express";
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { Express } from "express";
import http from "http";
import { schema } from "./schema";
import { context } from "./context";

export async function startApolloServer(app: Express) {
    const httpServer = http.createServer(app);
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
