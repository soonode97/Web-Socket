/** 서버 소켓과 연결하는 파일 */

// 클라이언트 버전을 가져옴
import { CLIENT_VERSION } from './Constants.js';
import my_key from './config.js';
//
const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

// userId 를 null로 설정해두고, connection 이벤트가 발생하면 message와 userId를 받아와 저장한다.
// response는 우리가 response로 반환하도록 설정했기(emit) 때문에 동일하게 맞춰준다.
let userId = null;

socket.on('response', (data) => {
  if (data.gameOverScore) {
    const currentTopScore = localStorage.getItem(my_key.MY_TOP_SCORE_KEY);
    if (currentTopScore < data.gameOverScore || !currentTopScore) {
      localStorage.setItem(my_key.MY_TOP_SCORE_KEY, Math.floor(data.gameOverScore));
    }
    // 랭크 갱신 기록이 정상적으로 완료되면 랭크를 갱신하도록 합니다.
    sendEvent(31, {
      currentScore: Math.floor(data.gameOverScore),
    });
  }

  if (data.topRankScore) {
    const topScore = data.topRankScore;
    localStorage.setItem(my_key.HIGH_SCORE_KEY, topScore);
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
