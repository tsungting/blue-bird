import {Goal} from './goal';

export class Evolution {

  public goals:Array<Goal> = [];
  public price:number = 0;
  public ownedStocks : Array<number> = [];
  public cashflow:number = 0;

  constructor(price = 0, goals = [], ownedStocks = [], cashflow =0) {
    this.goals = goals;
    this.ownedStocks = ownedStocks;
    this.cashflow = cashflow;
    this.price = price;
  }
}
