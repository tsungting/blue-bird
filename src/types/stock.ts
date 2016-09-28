export class Stock {
  public price: number = 0;
  public status: string;

  constructor(price, status = '') {
    this.price = price;
    this.status = status;
  }
}
