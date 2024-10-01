/**
 * 스테이지에 관련된 이벤트에 대한 핸들러가 담겨있음
 *
 * 유저는 스테이지를 하나씩 올라갈 수 있다. (1스테이지 -> 2, 2-> 3)
 * 유저는 일정 점수가 되면 다음 스테이지로 이동한다.
 */

import { getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';

// 스테이지 이동 핸들러
export const moveStageHandler = (uuid, payload) => {
  // 유저의 현재 스테이지 currentStage, 다음 스테이지 targetStage가 있고
  // 검증 절차를 통해 진행된다.

  // 유저의 현재 스테이지 정보 불러오기
  let currentStages = getStage(uuid);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user.' };
  }

  // 오름차순 -> 가장 큰 스테이지 ID를 확인 -> 유저의 현재 스테이지다
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트 vs 서버 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current Stage mismatch.' };
  }

  // 점수 검증 로직
  const serverTime = Date.now(); // 현재 타임스탬프
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

  // 만약, 1스테이지 -> 2스테이지로 넘어가는 과정을 가정했을때
  // 1. 100 미만이거나 105초보다 큰 경우 fail
  // => 100 미만은 아직 2 스테이지에 도달할 점수가 되지 않았다고 판단
  // => 105 초과는 latency가 길어졌을 경우를 대비하여 fail처리
  // 스테이지마다 숫자를 다르게 설정하도록 만들어야함.
  if (elapsedTime < 10 || elapsedTime > 10.5) {
    return { status: 'fail', message: 'Invalid elapsed time.' };
  }

  // targetStage 대한 검증 <- 게임에셋에 존재하는 스테이지인지 확인하는 절차
  // array.some() => some 메서드 내 조건문이 하나라도 일치하면 true를 반환해주는 메서드
  const { stages } = getGameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target Stage not found.' };
  }

  // 과제 : 클라이언트에서 받은 현재 점수가 targetStage의 요구 점수보다 높으면 setStage가 작동하도록 설정해주어야 한다.

  setStage(uuid, payload.targetStage, serverTime);

  return { status: 'success' };
};
