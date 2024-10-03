/**
 * 스테이지에 관련된 이벤트에 대한 핸들러가 담겨있음
 *
 * 유저는 스테이지를 하나씩 올라갈 수 있다. (1스테이지 -> 2, 2-> 3)
 * 유저는 일정 점수가 되면 다음 스테이지로 이동한다.
 */

import { getStage, setStage, getCurrentStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';
import { isValidStage } from '../services/validation.js';
import { getItemScoresEarnedByStage } from '../models/item.model.js';

// 스테이지 이동 핸들러
export const moveStageHandler = (uuid, payload) => {
  // 유저의 현재 스테이지 currentStage, 다음 스테이지 targetStage가 있고
  // 검증 절차를 통해 진행된다.
  const currentStage = getCurrentStage(uuid);

  // 클라이언트 vs 서버 비교
  isValidStage(payload, currentStage);

  // 점수 검증 로직
  // 시간으로 체크할 예정
  // 1. 스테이지가 이동될 때, 이동직전까지 걸린 시간을 계산 (elapsedTime)
  // 2. 현재 스테이지에서 초당 얻을 수 있는 점수(curStageScorePerSec)를 위 elapsedTime 에 곱연산
  // 3. 현재 스테이지에서 얻은 아이템 점수(curStageScoreFromItem)와 curStageScorePerSec 합연산
  // 4. 합연산 결과 (curStageTotalScore)가 다음 스테이지 점수와 오차범위 5 이내인지 확인
  const { stages } = getGameAssets();

  const stage = stages.data.find((e) => e.id === currentStage.id);
  if (!stage) {
    return { status: 'fail', message: 'Current Stage not found.' };
  }

  const serverTime = Date.now(); // 현재 타임스탬프
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;
  // console.log(elapsedTime);

  const curStageScorePerSec = elapsedTime * stage.scorePerSecond;
  // console.log('curStageScorePerSec: ' + curStageScorePerSec);

  const itemsScore = getItemScoresEarnedByStage(uuid, currentStage.id);
  // console.log('itemsScore: ' + itemsScore);

  const totalScore = Math.floor(curStageScorePerSec + itemsScore);
  // console.log('totalScore: ' + totalScore);

  if (totalScore < payload.score || totalScore > payload.score + 5) {
    return { status: 'fail', message: 'Score does not matched to Server.' };
  }

  // targetStage 대한 검증 <- 게임에셋에 존재하는 스테이지인지 확인하는 절차
  // array.some() => some 메서드 내 조건문이 하나라도 일치하면 true를 반환해주는 메서드
  const targetStage = stages.data.find((e) => e.id === payload.targetStage);
  if (!targetStage) {
    return { status: 'fail', message: 'Target Stage not found.' };
  }

  if (!totalScore >= targetStage.score) {
    return { status: 'fail', message: `Not enough score to move stages.` };
  }

  setStage(uuid, payload.targetStage, serverTime);
  return { status: 'success', message: `${payload.targetStage} 스테이지 이동 완료` };
};
