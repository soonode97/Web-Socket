/** 유저가 소켓에 (connection) 등록할 때 관리하는 스크립트
 *  io를 받아서 이벤트를 받는다
 */

import { v4 as uuidv4 } from 'uuid';
import { handleDisconnect, handleConnection, handlerEvent } from './helper.js';
import { addUser } from '../models/user.model.js';

// 유저 관리 핸들러
const registerHandler = (io) => {
  io.on('connection', (socket) => {
    /** 유저 접속 시 이벤트
     * 유저 UUID를 생성하는 로직
     * 유저 DB 파일에서 해도 되지만 여기서 진행하는 것이 더 보기 편할 것 같음.
     */
    const userUUID = uuidv4();
    addUser({ uuid: userUUID, socketId: socket.id });

    handleConnection(socket, userUUID);

    /**
     * 유저가 접속 중 발생하는 이벤트
     * data에는 uuid, handleId, clientVersion 우리가 짜놨던 정보가 들어올 예정
     */
    socket.on('event', (data) => handlerEvent(io, socket, data));

    /** 유저 접속 해제 시 이벤트
     *  유저를 소켓에서 제거해주는 로직
     * */
    socket.on('disconnect', (socket) => {
      handleDisconnect(socket, userUUID);
    });
  });
};

export default registerHandler;
