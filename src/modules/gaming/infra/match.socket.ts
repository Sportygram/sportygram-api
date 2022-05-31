export enum CallEvent {
    Connection = "connection",
    JoinRoom = "join_room",
    UserConnectedToStream = "user_connected_to_stream",
    UserDisconnectedFromStream = "user_disconnected_from_stream",
    Disconnect = "disconnect",
}

// TODO Create EventEmitter to listen to domainEvents
export const matchSocketHandler = (socket: any) => {
    console.log(">>>> a user connected");
    // join a room
    socket.on(CallEvent.JoinRoom, ({ roomId, userId }: any) => {
        //* add [userId, roomId] to room cache using socketId
        socket.join(roomId);
        console.log(">>>> a user joined", userId, roomId);

        //* Broadcast message to everyone except user that he has joined
        socket.to(roomId).emit(CallEvent.UserConnectedToStream, { userId });
    });

    // user typing

    // leave room
    socket.on(CallEvent.Disconnect, () => {
        const [roomId, userId] = ["bleh", "lmao"]; // get user details from cache
        socket
            .to(roomId)
            .emit(CallEvent.UserDisconnectedFromStream, { userId });
        // send offline to room
        console.log(">>>> user disconnected");
    });
};
