import { Prisma, PrismaClient } from "@prisma/client";
import { DomainEvents } from "../../../lib/domain/events/DomainEvents";

export const prisma: PrismaClient<Prisma.PrismaClientOptions, "query"> =
    new PrismaClient({
        ...(process.env.NODE_ENV === "development" && { log: ["query"] }),
    });

process.env.NODE_ENV === "development" &&
    prisma.$on("query", (e: any) => {
        console.log("Query: " + e.query);
        console.log("Params: " + e.params);
        console.log("Duration: " + e.duration + "ms");
    });

// This must always be the last middleware
prisma.$use(async (params, next) => {
    const result = await next(params);
    if (["create", "update", "upsert", "delete"].includes(params.action)) {
        DomainEvents.dispatchEventsHook(result.id);
    }
    return result;
});
