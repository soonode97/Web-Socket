import { getGameAssets } from '../init/assets.js';

import { createItems, getItem, setItem } from '../models/item.model.js';
import { getStage, getCurrentStage } from '../models/stage.model.js';
import { isValidItem, isValidStage } from '../services/validation.js';

/** 아이템 획득에 대한 핸들러 */
export const getItemScoreHandler = (uuid, payload) => {
  // 현재 스테이지에서 얻을 수 있는 아이템인지 확인
  // 유저의 현재 스테이지 정보 불러오기
  const currentStage = getCurrentStage(uuid);

  // 스테이지 유효성 검증
  isValidStage(payload, currentStage);

  // 아이템 검증 로직
  isValidItem(payload, currentStage);

  return { status: 'success' };
};
