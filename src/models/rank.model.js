/** 게임 점수 랭킹에 대한 데이터 모델 관련 스크립트 입니다. */

// 모든 유저의 최고 점수를 기록하도록 합니다.
const ranking = [];

export const getRankList = () => {
  return ranking;
};

export const setRankList = (uuid, score, timestamp, dupleIndex) => {
  // 중복 uuid가 있는 경우
  if (dupleIndex >= 0) {
    // 만약 기존 값보다 현재 점수가 크다면 값 갱신
    if (ranking[dupleIndex].score < score) {
      ranking[dupleIndex].score = score;
    }
  }
  // 중복 uuid가 없는 경우
  else {
    ranking.push({ uuid, score, timestamp });
  }
};

export const getDuplicateUserIndex = (uuid) => {
  return ranking.findIndex((user) => {
    return user.uuid === uuid;
  });
};
