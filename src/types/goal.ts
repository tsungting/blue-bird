export class Goal {
  public isBuy: boolean = true;
  public price: number = 0;

  constructor(price, isBuy) {
    this.isBuy = isBuy;
    this.price = price;
  }
}
