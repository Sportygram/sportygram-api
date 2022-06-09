import { asNexusMethod } from "nexus";
import {
    GraphQLDateTime,
    GraphQLCountryCode,
    GraphQLPhoneNumber,
    GraphQLEmailAddress,
    GraphQLJWT,
    GraphQLJSON,
    GraphQLIPv4,
} from "graphql-scalars";

export const GQLDate = asNexusMethod(GraphQLDateTime, "dateTime");
export const GQLCountryCode = asNexusMethod(GraphQLCountryCode, "countryCode");
export const GQLEmailAddress = asNexusMethod(GraphQLEmailAddress, "email");
export const GQLPhoneNumber = asNexusMethod(GraphQLPhoneNumber, "phone");
export const GQLJWT = asNexusMethod(GraphQLJWT, "jwt");
export const GQLJSON = asNexusMethod(GraphQLJSON, "json");
export const GQLIPv4 = asNexusMethod(GraphQLIPv4, "ipv4");
