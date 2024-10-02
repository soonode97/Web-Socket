/**
 * 게임 진행 중 획득한 아이템에 대한 데이터 모델을 정의하기 위한 스크립트
 *
 * key : uuid, value : array => item 정보는 배열
 */

const items = {};

// 아이템을 담을 바구니 생성
export const createItems = (uuid) => {
  items[uuid] = [];
};

export const getItem = (uuid) => {
  return items[uuid];
};

export const setItem = (uuid, id, timestamp) => {
  return items[uuid].push({ id, timestamp });
};

// 아이템 초기화
export const clearItems = (uuid) => {
  items[uuid] = [];
};
