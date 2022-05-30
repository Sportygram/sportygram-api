import { PrismaClient } from "@prisma/client";
import { DomainEvents } from "../../../lib/domain/events/DomainEvents";

export const prisma = new PrismaClient();

// This must always be the last middleware
prisma.$use(async (params, next) => {
    const result = await next(params);
    if (["create", "update", "upsert", "delete"].includes(params.action)) {
        DomainEvents.dispatchEventsHook(result.id);
    }
    return result;
});
