/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./context"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    dateTime<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
    /**
     * A country code as defined by ISO 3166-1 alpha-2
     */
    countryCode<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "CountryCode";
    /**
     * A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.
     */
    email<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "EmailAddress";
    /**
     * A field whose value conforms to the standard E.164 format as specified in: https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234.
     */
    phone<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "PhoneNumber";
    /**
     * A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction.
     */
    jwt<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "JWT";
    /**
     * The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "JSON";
    /**
     * A field whose value is a IPv4 address: https://en.wikipedia.org/wiki/IPv4.
     */
    ipv4<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "IPv4";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    dateTime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
    /**
     * A country code as defined by ISO 3166-1 alpha-2
     */
    countryCode<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "CountryCode";
    /**
     * A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.
     */
    email<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "EmailAddress";
    /**
     * A field whose value conforms to the standard E.164 format as specified in: https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234.
     */
    phone<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "PhoneNumber";
    /**
     * A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction.
     */
    jwt<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JWT";
    /**
     * The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JSON";
    /**
     * A field whose value is a IPv4 address: https://en.wikipedia.org/wiki/IPv4.
     */
    ipv4<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "IPv4";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  LoginInput: { // input type
    emailOrUsername: string; // String!
    ip?: NexusGenScalars['IPv4'] | null; // IPv4
    password: string; // String!
  }
  PredictionInput: { // input type
    fixtureId: string; // String!
    prediction: NexusGenScalars['JSON']; // JSON!
    predictionId?: string | null; // String
    predictionType: string; // String!
  }
  UpdateUserProfileInput: { // input type
    country?: string | null; // String
    favoriteTeam?: string | null; // String
    firstname?: string | null; // String
    lastname?: string | null; // String
    onboarded?: boolean | null; // Boolean
    username?: string | null; // String
  }
}

export interface NexusGenEnums {
  GameType: "DAILY" | "SEASON" | "WEEKLY"
  RoomType: "PRIVATE" | "PUBLIC"
  sort: "ASC" | "DESC"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  CountryCode: any
  DateTime: any
  EmailAddress: any
  IPv4: any
  JSON: any
  JWT: any
  PhoneNumber: any
}

export interface NexusGenObjects {
  AuthOutput: { // root type
    accessToken?: string | null; // String
    message: string; // String!
    refreshToken?: string | null; // String
    user: NexusGenRootTypes['User']; // User!
  }
  ChatUser: { // root type
    token: NexusGenScalars['JWT']; // JWT!
    username: string; // String!
  }
  CheckUsernameOutput: { // root type
    available: boolean; // Boolean!
    message: string; // String!
  }
  Country: { // root type
    code: string; // String!
    emoji: string; // String!
    name: string; // String!
  }
  CreateRoomOutput: { // root type
    message: string; // String!
    room: NexusGenRootTypes['Room']; // Room!
  }
  Cursor: { // root type
    next?: string | null; // String
    prev?: string | null; // String
  }
  Fixture: { // root type
    date: NexusGenScalars['DateTime']; // DateTime!
    fixtureId?: string | null; // ID
    misc: NexusGenScalars['JSON']; // JSON!
    periods?: number[] | null; // [Int!]
    predictions?: Array<NexusGenRootTypes['Prediction'] | null> | null; // [Prediction]
    scores?: NexusGenScalars['JSON'] | null; // JSON
    teams: NexusGenRootTypes['TeamData']; // TeamData!
    venue?: string | null; // String
  }
  Game: { // root type
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    data: NexusGenScalars['JSON']; // JSON!
    description?: string | null; // String
    expiringAt?: NexusGenScalars['DateTime'] | null; // DateTime
    gameId: string; // ID!
    gameType: NexusGenEnums['GameType']; // GameType!
    leaderBoard: Array<NexusGenRootTypes['GamePlayer'] | null>; // [GamePlayer]!
    name: string; // String!
    roomId: string; // ID!
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  GamePlayer: { // root type
    playerId: string; // ID!
    score: number; // Float!
    username: string; // String!
  }
  MatchStatistic: { // root type
    type?: string | null; // String
    value?: string | null; // String
  }
  MatchStatus: { // root type
    long?: string | null; // String
    short?: string | null; // String
    timeElapsed?: number | null; // Int
  }
  Mutation: {};
  Pagination: { // root type
    limit?: number | null; // Int
    page?: number | null; // Int
    pages?: number | null; // Int
    total?: number | null; // Int
  }
  Prediction: { // root type
    fixtureId: string; // String!
    prediction: NexusGenScalars['JSON']; // JSON!
    predictionId: string; // ID!
    predictionType: string; // String!
  }
  PredictionOutput: { // root type
    message: string; // String!
    prediction: NexusGenRootTypes['Prediction']; // Prediction!
  }
  Query: {};
  Room: { // root type
    admins?: Array<string | null> | null; // [String]
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description?: string | null; // String
    games?: Array<NexusGenRootTypes['Game'] | null> | null; // [Game]
    inviteLink: string; // String!
    joiningFee: number; // Float!
    name: string; // String!
    roomId: string; // ID!
    roomImageUrl?: string | null; // String
    roomType: NexusGenEnums['RoomType']; // RoomType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Team: { // root type
    code?: string | null; // ID
    logo?: string | null; // String
    name?: string | null; // String
    score?: string | null; // String
    stadium?: string | null; // String
    statistics?: Array<NexusGenRootTypes['MatchStatistic'] | null> | null; // [MatchStatistic]
    winner?: boolean | null; // Boolean
  }
  TeamData: { // root type
    away?: NexusGenRootTypes['Team'] | null; // Team
    home?: NexusGenRootTypes['Team'] | null; // Team
  }
  TokenSendOutput: { // root type
    message: string; // String!
    sent: boolean; // Boolean!
  }
  UpdateUserProfileOutput: { // root type
    message: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  User: { // root type
    coinBalance: number; // Float!
    country?: string | null; // String
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    email: NexusGenScalars['EmailAddress']; // EmailAddress!
    emailVerified: boolean; // Boolean!
    firstname?: string | null; // String
    gamesSummary?: NexusGenScalars['JSON'] | null; // JSON
    lastname?: string | null; // String
    onboarded: boolean; // Boolean!
    phone?: NexusGenScalars['PhoneNumber'] | null; // PhoneNumber
    profileImageUrl?: string | null; // String
    referralCode: string; // String!
    referralCount: number; // Int!
    roles: Array<string | null>; // [String]!
    rooms?: Array<NexusGenRootTypes['Room'] | null> | null; // [Room]
    settings?: NexusGenScalars['JSON'] | null; // JSON
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId: string; // ID!
    userState: string; // String!
    username?: string | null; // String
  }
}

export interface NexusGenInterfaces {
  CursorPaginationOutput: any;
  MutationOutput: NexusGenRootTypes['AuthOutput'] | NexusGenRootTypes['CheckUsernameOutput'] | NexusGenRootTypes['CreateRoomOutput'] | NexusGenRootTypes['PredictionOutput'] | NexusGenRootTypes['TokenSendOutput'] | NexusGenRootTypes['UpdateUserProfileOutput'];
  PaginatedInput: any;
  PaginationOutput: any;
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenInterfaces & NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  AuthOutput: { // field return type
    accessToken: string | null; // String
    message: string; // String!
    refreshToken: string | null; // String
    user: NexusGenRootTypes['User']; // User!
  }
  ChatUser: { // field return type
    token: NexusGenScalars['JWT']; // JWT!
    username: string; // String!
  }
  CheckUsernameOutput: { // field return type
    available: boolean; // Boolean!
    message: string; // String!
  }
  Country: { // field return type
    code: string; // String!
    emoji: string; // String!
    name: string; // String!
  }
  CreateRoomOutput: { // field return type
    message: string; // String!
    room: NexusGenRootTypes['Room']; // Room!
  }
  Cursor: { // field return type
    next: string | null; // String
    prev: string | null; // String
  }
  Fixture: { // field return type
    date: NexusGenScalars['DateTime']; // DateTime!
    fixtureId: string | null; // ID
    misc: NexusGenScalars['JSON']; // JSON!
    periods: number[] | null; // [Int!]
    predictions: Array<NexusGenRootTypes['Prediction'] | null> | null; // [Prediction]
    scores: NexusGenScalars['JSON'] | null; // JSON
    teams: NexusGenRootTypes['TeamData']; // TeamData!
    venue: string | null; // String
  }
  Game: { // field return type
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    data: NexusGenScalars['JSON']; // JSON!
    description: string | null; // String
    expiringAt: NexusGenScalars['DateTime'] | null; // DateTime
    gameId: string; // ID!
    gameType: NexusGenEnums['GameType']; // GameType!
    leaderBoard: Array<NexusGenRootTypes['GamePlayer'] | null>; // [GamePlayer]!
    name: string; // String!
    roomId: string; // ID!
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
  }
  GamePlayer: { // field return type
    playerId: string; // ID!
    score: number; // Float!
    username: string; // String!
  }
  MatchStatistic: { // field return type
    type: string | null; // String
    value: string | null; // String
  }
  MatchStatus: { // field return type
    long: string | null; // String
    short: string | null; // String
    timeElapsed: number | null; // Int
  }
  Mutation: { // field return type
    changePassword: NexusGenRootTypes['AuthOutput']; // AuthOutput!
    checkUsername: NexusGenRootTypes['CheckUsernameOutput']; // CheckUsernameOutput!
    createRoom: NexusGenRootTypes['CreateRoomOutput']; // CreateRoomOutput!
    joinRoom: NexusGenRootTypes['CreateRoomOutput']; // CreateRoomOutput!
    login: NexusGenRootTypes['AuthOutput']; // AuthOutput!
    predictMatch: NexusGenRootTypes['PredictionOutput']; // PredictionOutput!
    sendEmailVerification: NexusGenRootTypes['TokenSendOutput']; // TokenSendOutput!
    sendPasswordReset: NexusGenRootTypes['TokenSendOutput']; // TokenSendOutput!
    signup: NexusGenRootTypes['AuthOutput']; // AuthOutput!
    updatePrediction: NexusGenRootTypes['PredictionOutput']; // PredictionOutput!
    updateRoom: NexusGenRootTypes['CreateRoomOutput']; // CreateRoomOutput!
    updateUserProfile: NexusGenRootTypes['UpdateUserProfileOutput']; // UpdateUserProfileOutput!
    verifyEmail: NexusGenRootTypes['AuthOutput']; // AuthOutput!
  }
  Pagination: { // field return type
    limit: number | null; // Int
    page: number | null; // Int
    pages: number | null; // Int
    total: number | null; // Int
  }
  Prediction: { // field return type
    fixtureId: string; // String!
    prediction: NexusGenScalars['JSON']; // JSON!
    predictionId: string; // ID!
    predictionType: string; // String!
  }
  PredictionOutput: { // field return type
    message: string; // String!
    prediction: NexusGenRootTypes['Prediction']; // Prediction!
  }
  Query: { // field return type
    chatToken: string; // String!
    countries: Array<NexusGenRootTypes['Country'] | null>; // [Country]!
    fixtures: NexusGenRootTypes['Fixture'][]; // [Fixture!]!
    room: NexusGenRootTypes['Room']; // Room!
    teams: Array<NexusGenRootTypes['Team'] | null>; // [Team]!
    viewer: NexusGenRootTypes['User']; // User!
  }
  Room: { // field return type
    admins: Array<string | null> | null; // [String]
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description: string | null; // String
    games: Array<NexusGenRootTypes['Game'] | null> | null; // [Game]
    inviteLink: string; // String!
    joiningFee: number; // Float!
    name: string; // String!
    roomId: string; // ID!
    roomImageUrl: string | null; // String
    roomType: NexusGenEnums['RoomType']; // RoomType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Team: { // field return type
    code: string | null; // ID
    logo: string | null; // String
    name: string | null; // String
    score: string | null; // String
    stadium: string | null; // String
    statistics: Array<NexusGenRootTypes['MatchStatistic'] | null> | null; // [MatchStatistic]
    winner: boolean | null; // Boolean
  }
  TeamData: { // field return type
    away: NexusGenRootTypes['Team'] | null; // Team
    home: NexusGenRootTypes['Team'] | null; // Team
  }
  TokenSendOutput: { // field return type
    message: string; // String!
    sent: boolean; // Boolean!
  }
  UpdateUserProfileOutput: { // field return type
    message: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  User: { // field return type
    coinBalance: number; // Float!
    country: string | null; // String
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    email: NexusGenScalars['EmailAddress']; // EmailAddress!
    emailVerified: boolean; // Boolean!
    firstname: string | null; // String
    gamesSummary: NexusGenScalars['JSON'] | null; // JSON
    lastname: string | null; // String
    onboarded: boolean; // Boolean!
    phone: NexusGenScalars['PhoneNumber'] | null; // PhoneNumber
    profileImageUrl: string | null; // String
    referralCode: string; // String!
    referralCount: number; // Int!
    roles: Array<string | null>; // [String]!
    rooms: Array<NexusGenRootTypes['Room'] | null> | null; // [Room]
    settings: NexusGenScalars['JSON'] | null; // JSON
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId: string; // ID!
    userState: string; // String!
    username: string | null; // String
  }
  CursorPaginationOutput: { // field return type
    cursor: NexusGenRootTypes['Cursor']; // Cursor!
  }
  MutationOutput: { // field return type
    message: string; // String!
  }
  PaginatedInput: { // field return type
    limit: number | null; // Int
    page: number | null; // Int
  }
  PaginationOutput: { // field return type
    pagination: NexusGenRootTypes['Pagination']; // Pagination!
  }
}

export interface NexusGenFieldTypeNames {
  AuthOutput: { // field return type name
    accessToken: 'String'
    message: 'String'
    refreshToken: 'String'
    user: 'User'
  }
  ChatUser: { // field return type name
    token: 'JWT'
    username: 'String'
  }
  CheckUsernameOutput: { // field return type name
    available: 'Boolean'
    message: 'String'
  }
  Country: { // field return type name
    code: 'String'
    emoji: 'String'
    name: 'String'
  }
  CreateRoomOutput: { // field return type name
    message: 'String'
    room: 'Room'
  }
  Cursor: { // field return type name
    next: 'String'
    prev: 'String'
  }
  Fixture: { // field return type name
    date: 'DateTime'
    fixtureId: 'ID'
    misc: 'JSON'
    periods: 'Int'
    predictions: 'Prediction'
    scores: 'JSON'
    teams: 'TeamData'
    venue: 'String'
  }
  Game: { // field return type name
    createdAt: 'DateTime'
    data: 'JSON'
    description: 'String'
    expiringAt: 'DateTime'
    gameId: 'ID'
    gameType: 'GameType'
    leaderBoard: 'GamePlayer'
    name: 'String'
    roomId: 'ID'
    updatedAt: 'DateTime'
  }
  GamePlayer: { // field return type name
    playerId: 'ID'
    score: 'Float'
    username: 'String'
  }
  MatchStatistic: { // field return type name
    type: 'String'
    value: 'String'
  }
  MatchStatus: { // field return type name
    long: 'String'
    short: 'String'
    timeElapsed: 'Int'
  }
  Mutation: { // field return type name
    changePassword: 'AuthOutput'
    checkUsername: 'CheckUsernameOutput'
    createRoom: 'CreateRoomOutput'
    joinRoom: 'CreateRoomOutput'
    login: 'AuthOutput'
    predictMatch: 'PredictionOutput'
    sendEmailVerification: 'TokenSendOutput'
    sendPasswordReset: 'TokenSendOutput'
    signup: 'AuthOutput'
    updatePrediction: 'PredictionOutput'
    updateRoom: 'CreateRoomOutput'
    updateUserProfile: 'UpdateUserProfileOutput'
    verifyEmail: 'AuthOutput'
  }
  Pagination: { // field return type name
    limit: 'Int'
    page: 'Int'
    pages: 'Int'
    total: 'Int'
  }
  Prediction: { // field return type name
    fixtureId: 'String'
    prediction: 'JSON'
    predictionId: 'ID'
    predictionType: 'String'
  }
  PredictionOutput: { // field return type name
    message: 'String'
    prediction: 'Prediction'
  }
  Query: { // field return type name
    chatToken: 'String'
    countries: 'Country'
    fixtures: 'Fixture'
    room: 'Room'
    teams: 'Team'
    viewer: 'User'
  }
  Room: { // field return type name
    admins: 'String'
    createdAt: 'DateTime'
    description: 'String'
    games: 'Game'
    inviteLink: 'String'
    joiningFee: 'Float'
    name: 'String'
    roomId: 'ID'
    roomImageUrl: 'String'
    roomType: 'RoomType'
    updatedAt: 'DateTime'
  }
  Team: { // field return type name
    code: 'ID'
    logo: 'String'
    name: 'String'
    score: 'String'
    stadium: 'String'
    statistics: 'MatchStatistic'
    winner: 'Boolean'
  }
  TeamData: { // field return type name
    away: 'Team'
    home: 'Team'
  }
  TokenSendOutput: { // field return type name
    message: 'String'
    sent: 'Boolean'
  }
  UpdateUserProfileOutput: { // field return type name
    message: 'String'
    user: 'User'
  }
  User: { // field return type name
    coinBalance: 'Float'
    country: 'String'
    createdAt: 'DateTime'
    email: 'EmailAddress'
    emailVerified: 'Boolean'
    firstname: 'String'
    gamesSummary: 'JSON'
    lastname: 'String'
    onboarded: 'Boolean'
    phone: 'PhoneNumber'
    profileImageUrl: 'String'
    referralCode: 'String'
    referralCount: 'Int'
    roles: 'String'
    rooms: 'Room'
    settings: 'JSON'
    updatedAt: 'DateTime'
    userId: 'ID'
    userState: 'String'
    username: 'String'
  }
  CursorPaginationOutput: { // field return type name
    cursor: 'Cursor'
  }
  MutationOutput: { // field return type name
    message: 'String'
  }
  PaginatedInput: { // field return type name
    limit: 'Int'
    page: 'Int'
  }
  PaginationOutput: { // field return type name
    pagination: 'Pagination'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    changePassword: { // args
      newPassword: string; // String!
      oldPassword?: string | null; // String
    }
    checkUsername: { // args
      username: string; // String!
    }
    createRoom: { // args
      description?: string | null; // String
      name: string; // String!
    }
    joinRoom: { // args
      description?: string | null; // String
      name: string; // String!
    }
    login: { // args
      input: NexusGenInputs['LoginInput']; // LoginInput!
    }
    predictMatch: { // args
      input: NexusGenInputs['PredictionInput']; // PredictionInput!
    }
    sendEmailVerification: { // args
      email: string; // String!
    }
    sendPasswordReset: { // args
      email: string; // String!
    }
    signup: { // args
      email: string; // String!
      password?: string | null; // String
      referralCode?: string | null; // String
    }
    updatePrediction: { // args
      input: NexusGenInputs['PredictionInput']; // PredictionInput!
    }
    updateRoom: { // args
      description?: string | null; // String
      name: string; // String!
    }
    updateUserProfile: { // args
      input: NexusGenInputs['UpdateUserProfileInput']; // UpdateUserProfileInput!
    }
    verifyEmail: { // args
      token: string; // String!
    }
  }
  Query: {
    chatToken: { // args
      userId: string; // String!
    }
    fixtures: { // args
      date: string; // String!
    }
    room: { // args
      roomId: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
  MutationOutput: "AuthOutput" | "CheckUsernameOutput" | "CreateRoomOutput" | "PredictionOutput" | "TokenSendOutput" | "UpdateUserProfileOutput"
}

export interface NexusGenTypeInterfaces {
  AuthOutput: "MutationOutput"
  CheckUsernameOutput: "MutationOutput"
  CreateRoomOutput: "MutationOutput"
  PredictionOutput: "MutationOutput"
  TokenSendOutput: "MutationOutput"
  UpdateUserProfileOutput: "MutationOutput"
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = keyof NexusGenInterfaces;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    resolveType: false
    __typename: false
    isTypeOf: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}