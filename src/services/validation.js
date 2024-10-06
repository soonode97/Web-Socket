/** 검증에 관련된 함수가 모여있는 스크립트입니다.  */

/** 현재 스테이지 검증 로직 */
export const isValidStage = (payload, currentStage) => {
  // 현재 유저가 보낸 스테이지 정보가 맞는지 체크
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', type: 'unicast', message: 'Current Stage mismatch.' };
  }
  return { status: 'success' };
};

/** 다음 스테이지 검증 로직 */
export const isValidTargetStage = (payload, stages, calculatedServerScore) => {
  // 1. targetStage 대한 검증 <- 게임에셋에 존재하는 스테이지인지 확인하는 절차
  // => array.some() : some 메서드 내 조건문이 하나라도 일치하면 true를 반환해주는 메서드
  const targetStage = stages.data.find((e) => e.id === payload.targetStage);
  if (!targetStage) {
    return { status: 'fail', type: 'unicast', message: 'Target Stage not found.' };
  }

  // 2. totalScore가 다음 스테이지의 점수 조건에 충족하는지 확인하는 절차
  if (!calculatedServerScore >= targetStage.score) {
    return { status: 'fail', type: 'unicast', message: `Not enough score to move stages.` };
  }

  return { status: 'success' };
};

/** 아이템 검증 로직 */
export const isValidItem = (payload, item_unlocks, index) => {
  if (!index && index < 0) {
    return { status: 'fail', type: 'unicast', message: 'Stage not found.' };
  }

  if (!item_unlocks.data[index].item_id.includes(payload.itemId)) {
    return { status: 'fail', type: 'unicast', message: 'This item is not initialize in Stage.' };
  }

  return { status: 'success' };
};

/** 클라이언트와 현재 점수 검증 로직 */
export const isValidPresentScore = (beforeTotalScore, calculatedServerScore) => {
  if (beforeTotalScore === undefined) {
    return { status: 'fail', type: 'unicast', message: 'Score is not Number.' };
  }

  // payload.score를 지금 총합을 보내고 있다.
  // 서버에서 계산한 점수와 클라이언트에서 보낸 점수를 확인하는 절차
  // totalScore가 현재 스테이지 기준으로 계산되었으니 payload.currentScore에서 이전 스테이지의 스코어를 빼고 검사해야함.
  // => totalScore가 payload.currentScore와 +- 5 오차범위에 있는지 확인
  else if (
    calculatedServerScore > beforeTotalScore + 5 ||
    calculatedServerScore < beforeTotalScore - 5
  ) {
    return { status: 'fail', type: 'unicast', message: 'Score verification failed.' };
  }

  return { status: 'success' };
};
