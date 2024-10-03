/** 게임 시작 시 발생하는 핸들러
 * 1. 스테이지 점수 세팅
 */

import { getGameAssets } from '../init/assets.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';
import { clearItems } from '../models/item.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();

  clearStage(uuid);
  clearItems(uuid);

  // stages 배열에서 0번째 = 첫번째 스테이지
  // 현재 시간 정보도 스테이지에 설정할 수 있도록 한다
  // => 원래는 클라이언트 변조 가능성으로 인해 신뢰가 되지 않은 정보는 서버에 최대한 저장하지 않는 편
  // => 지금은 클라이언트를 신뢰한다는 가정하에 payload의 timestamp를 그대로 전달하였다.
  // => 신뢰하지 않는다면 어떻게 검증을 받을 수 있을까?
  setStage(uuid, stages.data[0].id, payload.timestamp);

  console.log(`Stage: ${JSON.stringify(getStage(uuid))}`);
  return { status: 'success' };
};

export const gameEnd = (uuid, payload) => {
  // 클라이언트는 게임 종료 시, 타임스탬프와 총 점수를 노출
  // 구조분해할당을 할 때, 콜론 뒤에 이름을 쓰면 이름변경이 가능하다.
  const { timestamp: gameEndTime, score } = payload;

  const stages = getStage(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user.' };
  }

  // 각 스테이지의 지속 시간을 계산하여 총 점수 계산
  let totalScore = 0;

  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stage.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      stageEndTime = stages[index + 1].timestamp;
    }

    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    totalScore += stageDuration; // 1초당 1점
  });

  // 점수와 타임스탬프 검증
  // 클라이언트의 score와 총 점수의 오차범위가 5보다 크다면 실패
  if (Math.abs(score - totalScore > 5)) {
    return { status: 'fail', message: 'Score verification failed.' };
  }

  // 만약 DB에 저장한다고 가정을 한다면
  // 여기서 저장을 할 수 있다.
  // setResult(uuid, score, timestamp) 같은 함수로...

  return { status: 'success', message: 'Game ended', score };
};
