import {Goal} from './goal';
import {Stock} from './stock';

export class Evolution {

  public goals: Array<Goal> = [];
  public price: number = 0;
  public ownedStocks: Array<Stock> = [];
  public cashflow: number = 0;
  public actionPointUp: number = -1;
  public actionPointDown: number = -1;
  public profit: number = 0;

  constructor(price = 0, goals = [], ownedStocks = [], cashflow = 0, actionPointUp = -1, actionPointDown = -1) {
    this.goals = goals.sort(this.sortByPrice);
    this.ownedStocks = ownedStocks.sort(this.sortByPrice);
    this.cashflow = cashflow;
    this.price = price;
    this.actionPointDown = actionPointDown;
    this.actionPointUp = actionPointUp;
    this.profit = this.calculateProfit(ownedStocks, price, cashflow);
  }

  private calculateProfit(stocks, price, cashflow) {
    let remainingStocks = stocks.filter((stock) => stock.status !== 'deleted');
    return remainingStocks.length * price + cashflow;
  }

  private sortByPrice(item1: any, item2: any) {
    return item2.price - item1.price;
  }
}
