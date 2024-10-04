/**
 * 스테이지에 관련된 이벤트에 대한 핸들러가 담겨있음
 *
 * 유저는 스테이지를 하나씩 올라갈 수 있다. (1스테이지 -> 2, 2-> 3)
 * 유저는 일정 점수가 되면 다음 스테이지로 이동한다.
 */
import { getGameAssets } from '../init/assets.js';
import {
  setStage,
  getCurrentStage,
  getCurrentStageScore,
  getStage,
} from '../models/stage.model.js';
import { isValidPresentScore, isValidStage, isValidTargetStage } from '../services/validation.js';

// 스테이지 이동 핸들러
export const moveStageHandler = (uuid, payload) => {
  const { stages } = getGameAssets();
  const serverTime = Date.now(); // 현재 타임스탬프
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

  // 다음 스테이지 검증 로직
  const targetStageValidationResult = isValidTargetStage(payload, stages, curStageTotalScore);
  if (targetStageValidationResult.status === 'fail') {
    return targetStageValidationResult;
  }

  setStage(uuid, payload.targetStage, Math.floor(payload.currentScore), serverTime);
  // console.log(getStage(uuid));

  return {
    status: 'success',
    type: 'unicast',
    message: `${payload.targetStage} 스테이지 이동 완료`,
  };
};
