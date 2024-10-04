import { sendEvent } from './Socket.js';
import assetData from './Assets.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  MY_TOP_SCORE_KEY = 'myTopScore';
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
    // 여기서 최고 점수를 받고 갱신을 하고 있는 상태인데 로컬 스토리지에 담아서 쓰고있다.
    // 로컬 스토리지가 아닌 rank 핸들러를 통해 최고점수를 세팅하고 보여주도록 하자.
    const currentRankTopScore = localStorage.getItem(this.HIGH_SCORE_KEY);
    if (currentRankTopScore < this.score || !currentRankTopScore) {
      sendEvent(31, {
        currentScore: Math.floor(this.score),
      });

      // if (topScore.status === 'success') {
      //   localStorage.setItem(this.HIGH_SCORE_KEY, topScore.score);
      // }
    }

    // const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    // if (this.score > highScore) {
    //   localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    // }
  }

  gameEnd() {
    console.log('게임 기록 요청을 보냅니다...');
    sendEvent(3, {
      currentStage: assetData.stage.data[this.currentStage].id,
      currentScore: Math.floor(this.score),
    });
  }

  getScore() {
    return this.score;
  }

  draw() {
    const myTopScore = Number(localStorage.getItem(this.MY_TOP_SCORE_KEY));
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const myTopScoreX = this.canvas.width - 775 * this.scaleRatio;
    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 225 * this.scaleRatio;

    const myTopScorePadded = myTopScore.toString().padStart(6, 0);
    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(`MY TOP SCORE : ${myTopScorePadded}`, myTopScoreX, y);
    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`TOP RANK :  ${highScorePadded}`, highScoreX, y);
  }

  getCurrentStageId() {
    return assetData.stage.data[this.currentStage].id;
  }
}

export default Score;
