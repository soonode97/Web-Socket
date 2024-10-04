import { isValidStage } from '../services/validation.js';
import { getItemScoresEarnedByStage } from './item.model.js';

/**
 * 스테이지마다 획득하는 점수에 대한 데이터 모델을 정의하기 위한 스크립트
 *
 * key : uuid, value : array => stage 정보는 배열
 * array인 이유는 stage 정보가 복수이기 때문
 */

const stages = {};

// 스테이지 정보를 담을 바구니 생성
export const createStage = (uuid) => {
  stages[uuid] = [];
};

export const getStage = (uuid) => {
  return stages[uuid];
};

export const setStage = (uuid, id, totalScore, timestamp) => {
  return stages[uuid].push({ id, totalScore, timestamp });
};

// 스테이지 초기화
export const clearStage = (uuid) => {
  stages[uuid] = [];
};

export const getCurrentStage = (uuid) => {
  // 유저의 현재 스테이지 정보 불러오기
  let currentStages = getStage(uuid);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user.' };
  }

  // 오름차순 -> 가장 큰 스테이지 ID를 확인 -> 유저의 현재 스테이지다
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];
  return currentStage;
};

export const getCurrentStageScore = (uuid, stage, currentStage, serverTime) => {
  // 현재 스테이지의 총 점수를 체크하는 로직
  // 1. 스테이지가 이동될 때, 이동직전까지 걸린 시간을 계산 (elapsedTime)
  // 2. 현재 스테이지에서 초당 얻을 수 있는 점수(curStageScorePerSec)를 위 elapsedTime 에 곱연산
  // 3. 현재 스테이지에서 얻은 아이템 점수(curStageScoreFromItem)와 curStageScorePerSec 합연산
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;
  // console.log(elapsedTime);

  const curStageScorePerSec = elapsedTime * stage.scorePerSecond;
  console.log('curStageScorePerSec: ' + curStageScorePerSec);

  const itemsScore = getItemScoresEarnedByStage(uuid, currentStage.id);
  console.log('itemsScore: ' + itemsScore);

  return curStageScorePerSec + itemsScore;
  // console.log('totalScore: ' + totalScore);
};
