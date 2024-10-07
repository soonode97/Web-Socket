import { setRankList, getRankList, getDuplicateUserIndex } from '../models/rank.model.js';

export const updateRankingHandler = (uuid, payload) => {
  const serverTime = Date.now();

  // 랭킹에 추가하기 전, 이미 랭킹에 들어가있는지 확인
  const dupleIndex = getDuplicateUserIndex(uuid);

  // 중복이라면 기존 기록과 비교하여 값 갱신하고 랭킹리스트에 추가합니다.
  setRankList(uuid, payload.currentScore, serverTime, dupleIndex);

  // 현재 랭킹리스트와 최고 랭킹의 점수를 조회합니다.
  const rankList = getRankList();

  // 랭킹 리스트를 내림차순으로 정렬합니다.
  rankList.sort((a, b) => b.score - a.score);

  // 랭킹은 최대 10개까지만 저장하도록 합니다.
  if (rankList.length > 10) {
    rankList.splice(rankList.length - 1, 1);
  }

  // 갱신 후 현재 1위 점수를 가져옵니다.
  const topRankScore = rankList[0].score;

  console.log(rankList);

  return {
    status: 'success',
    type: 'broadcast',
    topRankScore: topRankScore,
    message: `랭크 갱신...`,
  };
};

export const initHighScore = () => {
  const rankList = getRankList();
  console.log(rankList);
  if (rankList.length > 0) {
    console.log(`새로운 유저에게 랭킹 갱신중...`);
    return {
      status: 'success',
      type: 'unicast',
      message: '접속하여 현재 랭킹 갱신중..',
      topRankScore: rankList[0].score,
    };
  }
};

export const welcomeTopPlayerMessage = (uuid) => {
  const rankList = getRankList();
  if (rankList.length > 0) {
    if (rankList[0].uuid === uuid) {
      console.log(`랭킹 1등 ${uuid} 님이 접속하였습니다!`);
      return {
        status: 'success',
        type: 'unicast',
        message: '랭킹 1등님 접속을 환영합니다.',
        topRankScore: rankList[0].score,
      };
    }
  }
};
