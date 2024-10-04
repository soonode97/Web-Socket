/**
 * 게임 진행 중 획득한 아이템에 대한 데이터 모델을 정의하기 위한 스크립트
 *
 * key : uuid, value : array => item 정보는 배열
 */

const items = {};
// const itemsOfCurStage = {};

// 아이템을 담을 바구니 생성
export const createItems = (uuid) => {
  items[uuid] = [];
};

export const getItem = (uuid) => {
  return items[uuid];
};

export const setItem = (uuid, id, score, earnedStageId, timestamp) => {
  return items[uuid].push({ id, score, earnedStageId, timestamp });
};

// 아이템 초기화
export const clearItems = (uuid) => {
  items[uuid] = [];
};

export const getItemScoresEarnedByStage = (uuid, currentStageId) => {
  const items = getItem(uuid);

  const filteredItems = items.filter((e) => e.earnedStageId === currentStageId);

  if (filteredItems.length > 0) {
    const result = filteredItems.reduce((p, n) => ({ score: p.score + n.score }));
    return result.score;
  } else {
    return 0;
  }
};

export const getItemScoresEarnedByAllStages = (uuid) => {
  const items = getItem(uuid);

  if (items.length > 0) {
    const result = items.reduce((p, n) => ({ score: p.score + n.score }));
    return result.score;
  } else {
    return 0;
  }
};
