import assetsData from './Assets.js';
import Item from './Item.js';

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 12000;

  nextInterval = null;
  items = [];

  constructor(ctx, itemImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createItem(currentStageId) {
    // 아이템을 생성하려면 스테이지 정보와 스테이지에 해금되는 아이템에 맞는 아이템을 생성해야합니다.
    const items = this.getItemsForEachStage(currentStageId);
    // console.log(items);

    // Index를 랜덤으로 뽑음
    const index = this.getRandomNumber(0, items.length - 1);

    // console.log(items[index]);

    // 아이템 점수를 가져오기 위해 아이템을 찾습니다.
    const createdItem = assetsData.item.data.find((e) => e.id === items[index]);

    // Index를 가지고 아이템을 지정하고 해당 아이템의 실제 id값을 itemInfo에 저장하도록 함
    const itemInfo = this.itemImages[items[index] - 1];
    console.log(itemInfo);
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

    const item = new Item(
      this.ctx,
      itemInfo.id,
      x,
      y,
      itemInfo.width,
      itemInfo.height,
      itemInfo.image,
      createdItem.score,
    );

    this.items.push(item);
  }

  update(gameSpeed, deltaTime, currentStage) {
    if (this.nextInterval <= 0) {
      // stage에 맞는 아이템을 생성시켜주기위해 스테이지 정보를 줍니다.
      this.createItem(currentStage);
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  // 아이템 충돌에 따른 로직 처리, itemId를 반환하도록 되어있음.
  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
  }

  getItemsForEachStage(currentStageId) {
    // console.log(currentStageId);
    const unlockItemIndex = assetsData.item_unlock.data.findIndex(
      (e) => e.stage_id === currentStageId,
    );

    // console.log(unlockItemIndex);
    return assetsData.item_unlock.data[unlockItemIndex].item_id;
  }
}

export default ItemController;
