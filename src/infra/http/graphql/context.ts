import { Request } from "express";

export interface Context {}

export const context = (_: { req: Request }): Context => {
    return {};
};
