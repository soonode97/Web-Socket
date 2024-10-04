/**
 * 클라이언트에 보내줄 핸들러의 정보들에 대한 매핑이 담겨있음
 */

import { moveStageHandler } from './stage.handler.js';
import { gameStart, gameEnd } from './game.handler.js';
import { getItemScoreHandler } from './item.handler.js';
import { updateRankHandler } from './rank.hanlder.js';

// 스테이지 이동 핸들러 매핑
const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  // 11번이라는 메세지가 들어오면 moveStageHandler가 작동하도록 함.
  // 절대 괄호를 붙이지 말 것. 괄호를 붙이면 실행된 결과가 담겨있기 때문
  11: moveStageHandler,
  21: getItemScoreHandler,
  31: updateRankHandler,
};

export default handlerMappings;
