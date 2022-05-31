import { ForbiddenError } from "apollo-server-core";
import { enumType, interfaceType, objectType } from "nexus";

export function withUser(f: Function) {
    return (parent: any, args: any, ctx: any, ...others: any[]) => {
        if (!ctx.reqUser) throw new ForbiddenError("Token Signature Expired");
        return f(parent, args, ctx, ...others);
    };
}

export const Sort = enumType({
    name: "sort",
    members: ["ASC", "DESC"],
});

export const PaginatedInput = interfaceType({
    name: "PaginatedInput",
    definition(t) {
        t.int("page");
        t.int("limit", { description: "Number of items per page" });
    },
});

export const Pagination = objectType({
    name: "Pagination",
    definition(t) {
        t.int("page");
        t.int("limit");
        t.int("total");
        t.int("pages");
    },
});

// https://medium.com/swlh/how-to-implement-cursor-pagination-like-a-pro-513140b65f32
export const Cursor = objectType({
    name: "Cursor",
    definition(t) {
        t.string("next");
        t.string("prev");
    },
});

export const PaginationOutput = interfaceType({
    name: "PaginationOutput",
    definition(t) {
        t.nonNull.field("pagination", {
            type: "Pagination",
            resolve: (o) => {
                return {
                    page: o.page,
                    limit: o.limit,
                    total: o.total,
                    pages: o.pages,
                };
            },
        });
    },
});

export const CursorPaginationOutput = interfaceType({
    name: "CursorPaginationOutput",
    definition(t) {
        t.nonNull.field("cursor", {
            type: "Cursor",
            resolve: (o) => {
                return { next: o.next, prev: o.prev };
            },
        });
    },
});

export const MutationOutput = interfaceType({
    name: "MutationOutput",
    definition(t) {
        t.nonNull.string("message");
    },
});
