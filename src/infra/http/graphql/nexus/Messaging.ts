import {
    arg,
    enumType,
    extendType,
    inputObjectType,
    nonNull,
    objectType,
    stringArg,
} from "nexus";
import { addUserToRoomResolver } from "../../../../modules/messaging/useCases/addUserToRoom/addUserToRoomResolver";
import { createRoomResolver } from "../../../../modules/messaging/useCases/createRoom/createRoomResolver";
import { roomQueryResolver } from "../../../../modules/messaging/useCases/fetchQueryRoom/fetchQueryRoomResolver";
import { chatTokenResolver } from "../../../../modules/messaging/useCases/generateChatToken/chatTokenResolver";
import { updateRoomResolver } from "../../../../modules/messaging/useCases/updateRoom/updateRoomResolver";
import { withUser } from "./utils";

export const ChatData = objectType({
    name: "ChatData",
    definition(t) {
        t.nonNull.string("streamUserId");
        t.nonNull.string("token");
    },
});

export const RoomType = enumType({
    name: "RoomType",
    members: ["public", "private"],
});

export const Room = objectType({
    name: "Room",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("name");
        t.string("description");
        t.nonNull.field("roomType", { type: "RoomType" });
        t.string("roomImageUrl");
        t.nonNull.float("joiningFee");
        t.list.field("games", { type: "Game" });
        t.nonNull.dateTime("createdAt");
        t.nonNull.dateTime("updatedAt");
    },
});

export const MessagingQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.field("chatToken", {
            type: "String",
            resolve: withUser(chatTokenResolver),
        });

        t.nonNull.field("room", {
            type: "Room",
            args: {
                roomId: nonNull(stringArg()),
            },
            resolve: withUser(roomQueryResolver),
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

export const UpdateRoomInput = inputObjectType({
    name: "UpdateRoomInput",
    definition(t) {
        t.nonNull.string("roomId");
        t.string("name");
        t.string("description");
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
                roomType: stringArg(),
            },
            resolve: withUser(createRoomResolver),
        });

        t.nonNull.field("joinRoom", {
            type: "CreateRoomOutput",
            args: {
                roomId: nonNull(stringArg()),
            },
            resolve: withUser(addUserToRoomResolver),
        });

        t.nonNull.field("updateRoom", {
            type: "CreateRoomOutput",
            args: {
                input: arg({ type: nonNull(UpdateRoomInput) }),
            },
            resolve: withUser(updateRoomResolver),
        });
    },
});
