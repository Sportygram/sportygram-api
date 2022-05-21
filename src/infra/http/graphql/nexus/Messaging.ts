import { enumType, extendType, nonNull, objectType, stringArg } from "nexus";
import { accessTokenMock } from "./mocks/Auth";
import { getRoomMock } from "./mocks/Messaging";

export const ChatUser = objectType({
    name: "ChatUser",
    definition(t) {
        t.nonNull.string("username");
        t.nonNull.jwt("token");
    },
});

export const RoomType = enumType({
    name: "RoomType",
    members: ["PUBLIC", "PRIVATE"],
});

export const Room = objectType({
    name: "Room",
    definition(t) {
        t.nonNull.string("name");
        t.nonNull.id("roomId");
        t.nonNull.string("inviteLink");
        t.nonNull.field("roomType", { type: "RoomType" });
        t.string("roomImageUrl");
        t.string("description");
        t.list.string("admins");
        t.list.field("games", { type: "Game" });
        t.nonNull.float("joiningFee");
        t.nonNull.dateTime("createdAt");
        t.nonNull.dateTime("updatedAt");
    },
});

export const MessagingQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.field("chatToken", {
            type: "String",
            args: {
                userId: nonNull(stringArg()),
            },
            async resolve(_parent, _args, _context, _info) {
                return accessTokenMock;
            },
        });

        t.nonNull.field("room", {
            type: "Room",
            args: {
                roomId: nonNull(stringArg()),
            },
            async resolve(_parent, _args, _context, _info) {
                return getRoomMock();
            },
        });
    },
});

export const CreateRoomOutput = objectType({
    name: "CreateRoomOutput",
    definition(t) {
        t.implements("MutationOutput");
        t.nonNull.field("room", { type: "Room" });
    },
});

export const MessagingMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createRoom", {
            type: "CreateRoomOutput",
            args: {
                name: nonNull(stringArg()),
                description: stringArg(),
            },
            async resolve(_parent, _args, _context) {
                return {
                    message: "Chat Room Created",
                    room: getRoomMock(),
                };
            },
        });

        t.nonNull.field("joinRoom", {
            type: "CreateRoomOutput",
            args: {
                name: nonNull(stringArg()),
                description: stringArg(),
            },
            async resolve(_parent, _args, _context) {
                return {
                    message: "Room Joined",
                    room: getRoomMock(),
                };
            },
        });

        t.nonNull.field("updateRoom", {
            type: "CreateRoomOutput",
            args: {
                name: nonNull(stringArg()),
                description: stringArg(),
            },
            async resolve(_parent, _args, _context) {
                return {
                    message: "Room Updated",
                    room: getRoomMock(),
                };
            },
        });
    },
});
