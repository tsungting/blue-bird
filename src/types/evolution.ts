import {Goal} from './goal';

export class Evolution {

  public goals: Array<Goal> = [];
  public price: number = 0;
  public ownedStocks: Array<number> = [];
  public cashflow: number = 0;

  constructor(price = 0, goals = [], ownedStocks = [], cashflow = 0) {
    this.goals = goals.sort(this.sortGoals);
    this.ownedStocks = ownedStocks.sort();
    this.cashflow = cashflow;
    this.price = price;
  }

  private sortGoals(goal1: Goal, goal2: Goal) {
    return goal2.price - goal1.price;
  }
}
