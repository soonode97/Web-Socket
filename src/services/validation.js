// 검증에 관련된 스크립트입니다.

import { getGameAssets } from '../init/assets.js';

export const isValidStage = (payload, currentStage) => {
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current Stage mismatch.' };
  }
};

export const isValidItem = (payload, currentStage) => {
  const { item_unlocks } = getGameAssets();
  const index = item_unlocks.data.findIndex((e) => e.stage_id === currentStage.id);
  if (!index) {
    return { status: 'fail', message: 'Stage not found.' };
  }

  if (!item_unlocks.data[index].item_id.includes(payload.itemId)) {
    return { status: 'fail', message: 'This item is not initialize in Stage.' };
  }
};
