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

export const setStage = (uuid, id, timestamp) => {
  return stages[uuid].push({ id, timestamp });
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
