import { getRanks } from '../models/rank.model.js';

export const updateRankHandler = (uuid, payload) => {
  // 랭크를 어떻게 하면 좋을까..

  const ranks = getRanks();
  //   console.log(ranks[0]);

  // 1. 점수를 기록하는 곳에서 최고 점수가 나오면
  return {
    status: 'success',
    type: 'broadcast',
    topRankScore: payload.currentScore,
    message: `랭크 갱신 성공!!`,
  };
};
