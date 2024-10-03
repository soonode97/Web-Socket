import { sendEvent } from './Socket.js';
import assetData from './Assets.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  currentStage = 0;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    // 초당 점수 획득
    this.score += deltaTime * 0.001 * assetData.stage.data[this.currentStage].scorePerSecond;

    // 만약 다음 스테이지 진입 점수에 도달하는 경우 서버에 메시지 전송 및 스테이지 이동
    if (
      this.stageChange &&
      Math.floor(this.score) >= assetData.stage.data[this.currentStage + 1].score
    ) {
      console.log('다음 스테이지 이동 보낸다!!');
      sendEvent(11, {
        currentStage: assetData.stage.data[this.currentStage].id,
        targetStage: assetData.stage.data[this.currentStage + 1].id,
        currentScore: this.score,
      });
      this.currentStage++;
    }

    // 최종 스테이지인 경우 스테이지 이동을 못하도록 막음.
    if (!assetData.stage.data[this.currentStage + 1]) {
      this.stageChange = false;
    }
  }

  // 아이템을 획득할 때, 패킷을 보내고 현재 점수를 아이템 스코어만큼 증가시키도록 한다.
  getItem(itemId) {
    const getItem = assetData.item.data.find((e) => e.id === itemId);
    sendEvent(21, {
      currentStage: assetData.stage.data[this.currentStage].id,
      itemId: itemId,
      score: getItem.score,
    });
    this.score += getItem.score;
  }

  reset() {
    this.score = 0;
    // 스테이지 및 스테이지 별 점수 획득 초기화
    this.currentStage = 0;
    // 최종스테이지로 false 처리 된 경우 다시 true로 변경
    this.stageChange = true;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }

  getCurrentStageId() {
    return assetData.stage.data[this.currentStage].id;
  }
}

export default Score;
