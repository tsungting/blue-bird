
import {Goal} from '../types/goal';
import {Evolution} from '../types/evolution';

export class RandomTickerEvolutionGenerator {
  public getEvolution(price, evolutions: Array<Evolution>) {
    let evolution = evolutions[evolutions.length - 1];
    if (this.canCompleteGoal(price, evolution)) {
      return this.makeResolveGoalEvolution(price, evolution);
    }
    if (this.canMakeNewGoal(price, evolution)) {
      return this.makeNewGoalEvolution(price, evolution);
    }
    return this.makeNoActionEvolution(price, evolution);
  }

  private makeNoActionEvolution(price, evolution: Evolution) {
    return new Evolution(price, evolution.goals, evolution.ownedStocks, evolution.cashflow);
  }

  private makeNewGoalEvolution(price, evolution) {
    if (this.canMakeGoalToSell(price, evolution)) {
      return this.makeGoalToSell(price, evolution);
    }
    if (this.canMakeGoalToBuy(price, evolution)) {
      return this.makeGoalToBuy(price, evolution);
    }
  }

  private makeGoalToBuy(price, evolution) {
    let newGoal = new Goal(price - 1, true);
    let newGoals = evolution.goals.concat(newGoal);
    let newStocks = evolution.ownedStocks;
    let newCashflow = evolution.cashflow + newStocks.pop();
    return new Evolution(price, newGoals, newStocks, newCashflow);
  }

  private makeGoalToSell(price, evolution) {
    let newGoal = new Goal(price + 1, false);
    let newGoals = evolution.goals.concat(newGoal);
    let newStocks = evolution.ownedStocks.concat(price);
    let newCashflow = evolution.cashflow - price;
    return new Evolution(price, newGoals, newStocks, newCashflow);
  }

  private canMakeNewGoal(price, evolution: Evolution) {
    return this.canMakeGoalToSell(price, evolution) || this.canMakeGoalToBuy(price, evolution);
  }

  private canMakeGoalToSell(price, evolution: Evolution) {
    let existingGoalToSell = evolution.goals.find((goal: Goal) => {
      return goal.price === price + 1;
    });
    return !existingGoalToSell && !this.isTooManyStocks(evolution.ownedStocks);
  }

  private canMakeGoalToBuy(price, evolution: Evolution) {
    let existingGoalToBuy = evolution.goals.find((goal) => {
      return goal.price === price - 1;
    });
    return !existingGoalToBuy && evolution.ownedStocks.length > 0;
  }

  private isTooManyStocks(stocks) {
    return stocks.length > 2;
  }

  private makeResolveGoalEvolution(price, evolution: Evolution) {
    let goal = this.getCompletableGoal(price, evolution.goals);
    let remainingGoals = this.getRemainingGoals(price, evolution.goals);
    let remainingStocks = this.getStocks(evolution.ownedStocks, goal, price);
    let remainingCashflow = this.getCashflow(evolution.cashflow, goal, price);
    return new Evolution(price, remainingGoals, remainingStocks, remainingCashflow);
  }

  private getCashflow(originalCash, goal, price) {
    return goal.isBuy ? originalCash - price : originalCash + price;
  }

  private getStocks(stocks, goal: Goal, price) {
    if (goal.isBuy) {
      stocks.push(price);
      return stocks;
    }
    stocks.pop();
    return stocks;
  }

  private getRemainingGoals(price, goals) {
    return goals.filter((goal) => {
      return goal.price !== price;
    });
  }

  private canCompleteGoal(currentPrice, evolution: Evolution) {
    if (!evolution) {
      return false;
    }
    let completableGoal = this.getCompletableGoal(currentPrice, evolution.goals);
    if (!completableGoal) {
      return false;
    }
    if (this.isGoalSellButNoStock(completableGoal.isBuy, evolution.ownedStocks)) {
      return false;
    }
    return true;
  }

  private isGoalSellButNoStock(isBuy, stocks) {
    return !isBuy && stocks.length === 0;
  }

  private getCompletableGoal(price, goals): Goal {
    return goals.find((goal: Goal) => {
      return goal.price === price;
    });
  }
}
