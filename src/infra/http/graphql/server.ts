import { ApolloServer } from "apollo-server-express";
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { Express } from "express";
import { schema } from "./schema";
import { context } from "./context";
import { Server } from "http";
// https://github.com/bfmatei/apollo-prometheus-exporter
// https://grafana.com/docs/grafana-cloud/integrations/integrations/integration-apolloserver/
import { createPrometheusExporterPlugin } from "@bmatei/apollo-prometheus-exporter";
import { loggerPlugin } from "./loggerPlugin";

export async function startApolloServer(app: Express, httpServer: Server) {
    const server = new ApolloServer({
        schema,
        context,
        csrfPrevention: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground(),
            createPrometheusExporterPlugin({
                app,
            }),
            loggerPlugin,
        ],
    });
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    return { server, app };
}
