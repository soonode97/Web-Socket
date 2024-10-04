// import { getGameAssets } from '../init/assets.js';
// import { getGameRecords, setGameRecords } from '../models/record.model.js';
// import { getCurrentStageScore, getCurrentStage } from '../models/stage.model.js';
// import { isValidStage, isValidPresentScore } from '../services/validation.js';

// export const setGameRecordHandler = (uuid, payload) => {
//   const { stages } = getGameAssets();
//   const serverTime = Date.now();
//   const currentStage = getCurrentStage(uuid);

//   // 스테이지 검증 절차
//   const stageValidationResult = isValidStage(payload, currentStage);
//   if (stageValidationResult.status === 'fail') {
//     return stageValidationResult;
//   }

//   // 현재 스테이지가 데이터 테이블에 있는지 체크
//   const stage = stages.data.find((e) => e.id === currentStage.id);
//   if (!stage) {
//     return { status: 'fail', type: 'unicast', message: 'Current Stage not found.' };
//   }

//   // 점수 계산
//   const curStageTotalScore = getCurrentStageScore(uuid, stage, currentStage, serverTime);
//   // 점수 검증 로직
//   const presentScoreValidationResult = isValidPresentScore(
//     payload.currentScore - currentStage.totalScore,
//     curStageTotalScore,
//   );
//   if (presentScoreValidationResult.status === 'fail') {
//     return presentScoreValidationResult;
//   }

//   setGameRecords(uuid, currentStage.id, payload.currentScore, serverTime);
//   // console.log(getGameRecords(uuid));

//   return { status: 'success', type: 'unicast' };
// };
