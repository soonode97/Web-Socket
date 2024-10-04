/** 게임 점수 랭킹에 대한 데이터 모델 관련 스크립트 입니다. */

// 모든 유저의 최고 점수를 기록하도록 합니다.
const ranks = {};

export const createRanks = (io) => {
  ranks[io] = [];
};

export const getRanks = (io) => {
  return ranks;
};

export const setRanks = (uuid, score, timestamp) => {
  return ranks[uuid].push({ uuid, score, timestamp });
};

export const getTotalHighRank = () => {
  return ranks[0];
};
