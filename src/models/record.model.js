/** 게임 기록에 대한 데이터 모델 관련 스크립트 입니다. */

const gameRecords = {};

export const createGameRecords = (uuid) => {
  gameRecords[uuid] = [];
};

export const getGameRecords = (uuid) => {
  return gameRecords[uuid];
};

export const setGameRecords = (uuid, endStage, score, timestamp) => {
  return gameRecords[uuid].push({ endStage, score, timestamp });
};

export const clearRecords = (uuid) => {
  gameRecords[uuid] = [];
};

export const getUserHighScore = (uuid) => {
  const userMatches = getGameRecords(uuid).sort((a, b) => b.score - a.score);
  return userMatches[0].score;
};
