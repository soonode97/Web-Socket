// 어떠한 특정 기능을 하지 않지만 필요한 도움을 주는 함수들

import { getUser, removeUser } from "../models/user.model.js"

export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id);
    console.log(`User Disconnected: ${socket.id}`);
    console.log(`Current users: ${getUser()}`);
}