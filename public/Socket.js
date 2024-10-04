/** 서버 소켓과 연결하는 파일 */

// 클라이언트 버전을 가져옴
import { CLIENT_VERSION } from './Constants.js';

//
const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

// userId 를 null로 설정해두고, connection 이벤트가 발생하면 message와 userId를 받아와 저장한다.
// response는 우리가 response로 반환하도록 설정했기(emit) 때문에 동일하게 맞춰준다.
let userId = null;
const HIGH_SCORE_KEY = 'highScore';
const MY_TOP_SCORE_KEY = 'myTopScore';

socket.on('response', (data) => {
  if (data.gameOverScore) {
    const currentTopScore = localStorage.getItem(MY_TOP_SCORE_KEY);
    if (currentTopScore < data.gameOverScore || !currentTopScore) {
      localStorage.setItem(MY_TOP_SCORE_KEY, Math.floor(data.gameOverScore));
    }
  }
  console.log(data);
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
});

// 클라이언트에서는 event 란 이름으로 모든 요청을 보내도록 설정한다.
const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent };
