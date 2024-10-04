/** 게임 시작 시 발생하는 핸들러
 * 1. 스테이지 점수 세팅
 */

import { getGameAssets } from '../init/assets.js';
import { getGameRecords, setGameRecords } from '../models/record.model.js';
import {
  clearStage,
  getStage,
  setStage,
  getCurrentStageScore,
  getCurrentStage,
} from '../models/stage.model.js';
import { clearItems } from '../models/item.model.js';
import { isValidStage, isValidPresentScore } from '../services/validation.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();

  clearStage(uuid);
  clearItems(uuid);

  // stages 배열에서 0번째 = 첫번째 스테이지
  // 현재 시간 정보도 스테이지에 설정할 수 있도록 한다
  // => 원래는 클라이언트 변조 가능성으로 인해 신뢰가 되지 않은 정보는 서버에 최대한 저장하지 않는 편
  // => 지금은 클라이언트를 신뢰한다는 가정하에 payload의 timestamp를 그대로 전달하였다.
  // => 신뢰하지 않는다면 어떻게 검증을 받을 수 있을까?
  setStage(uuid, stages.data[0].id, 0, payload.timestamp);

  console.log(`Stage: ${JSON.stringify(getStage(uuid))}`);
  return { status: 'success', type: 'unicast' };
};

export const gameEnd = (uuid, payload) => {
  const { stages } = getGameAssets();
  const serverTime = Date.now();
  const currentStage = getCurrentStage(uuid);

  // 스테이지 검증 절차
  const stageValidationResult = isValidStage(payload, currentStage);
  if (stageValidationResult.status === 'fail') {
    return stageValidationResult;
  }

  // 현재 스테이지가 데이터 테이블에 있는지 체크
  const stage = stages.data.find((e) => e.id === currentStage.id);
  if (!stage) {
    return { status: 'fail', type: 'unicast', message: 'Current Stage not found.' };
  }

  // 점수 계산
  const curStageTotalScore = getCurrentStageScore(uuid, stage, currentStage, serverTime);
  // 점수 검증 로직
  const presentScoreValidationResult = isValidPresentScore(
    payload.currentScore - currentStage.totalScore,
    curStageTotalScore,
  );
  if (presentScoreValidationResult.status === 'fail') {
    return presentScoreValidationResult;
  }

  setGameRecords(uuid, currentStage.id, payload.currentScore, serverTime);
  console.log(getGameRecords(uuid));

  return {
    status: 'success',
    type: 'unicast',
    message: 'Game Over',
    gameOverScore: payload.currentScore,
  };
};
