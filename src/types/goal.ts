export class Goal {
  public isBuy: boolean = true;
  public price: number = 0;
  public status: string;

  constructor(price, isBuy, status = '') {
    this.isBuy = isBuy;
    this.price = price;
    this.status = status;
  }
}
