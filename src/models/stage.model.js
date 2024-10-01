/**
 * 스테이지마다 획득하는 점수에 대한 데이터 모델을 정의하기 위한 스크립트
 *
 * key : uuid, value : array => stage 정보는 배열
 * array인 이유는 stage 정보가 복수이기 때문
 */

const stages = {};

// 스테이지 초기화
export const createStage = (uuid) => {
  stages[uuid] = [];
};

export const getStage = (uuid) => {
  return stages[uuid];
};

export const setStage = (uuid, id, timestamp) => {
  return stages[uuid].push({ id, timestamp });
};

export const clearStage = (uuid) => {
  stages[uuid] = [];
};
