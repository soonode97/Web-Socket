import { Server as SocketIO } from 'socket.io'  // Server라는걸 가져올건데 이름이 햇갈려서 구분하기 위해 SocketIO로 명명
import registerHandler from '../handlers/register.handler.js';

const initSocket = (server) => {
    const io = new SocketIO();
    io.attach(server);

    // 소켓에 이벤트를 연결 핸들러를 등록한다.
    registerHandler(io);
}

export default initSocket;