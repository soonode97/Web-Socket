// 어떠한 특정 기능을 하지 않지만 이벤트가 발생하면 필요한 도움을 주는 함수들

import { CLIENT_VERSION } from '../constants.js';
import { createStage, getStage, setStage } from '../models/stage.model.js';
import { createItems } from '../models/item.model.js';
import { getUser, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';
import { createGameRecords, clearRecords } from '../models/record.model.js';

// 유저가 접속을 해제했을 때 세팅할 함수
export const handleDisconnect = (socket, uuid) => {
  clearRecords(uuid);
  removeUser(socket.id);
  console.log(`User Disconnected: ${socket.id}`);
  console.log(`Current users: ${getUser()}`);
};

// 유저가 접속했을 때 세팅을 도와주는 함수
export const handleConnection = (socket, uuid) => {
  console.log(`New user connected!: ${uuid} with socket ID ${socket.id}`);
  console.log(`Current users: ${getUser()}`);

  createGameRecords(uuid);
  createStage(uuid);
  createItems(uuid);

  socket.emit(`connection`, { uuid });
};

// 핸들러 이벤트가 작동하면 발생할 함수
export const handlerEvent = (io, socket, data) => {
  // 클라이언트 버전 체크
  if (!data.clientVersion) {
    socket.emit('response', { status: 'fail', message: 'Client not found.' });
  }

  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch.' });
    return;
  }

  const handler = handlerMappings[data.handlerId];

  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found.' });
  }

  const response = handler(data.userId, data.payload);

  // 만약 서버에 연결된 모든 소켓(유저)에 응답을 해야하는 경우 broadcast를 사용한다.
  if (response.type === 'broadcast') {
    io.emit('response', response);
    return;
  }

  socket.emit('response', response);
};
