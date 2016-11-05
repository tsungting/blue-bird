import {Goal} from '../types/goal';
import {Evolution} from '../types/evolution';
import {Stock} from '../types/stock';

export class WebTickerEvolutionGenerator {

  private actionPoint = 0.05;
  private stockPool = 3;

  constructor(actionPoint = '0.05', stockPool = '3') {
    this.actionPoint = parseFloat(actionPoint);
    this.stockPool = parseInt(stockPool, 10);
  }

  public getEvolution(price, evolutions: Array<Evolution>) {
    let referenceEvolution = this.getReferenceEvolution(evolutions);
    if (this.isStartOfTime(referenceEvolution)) {
      return new Evolution(price, [], [], 0, price, price);
    }
    if (this.canCompleteGoal(price, referenceEvolution)) {
      return this.makeResolveGoalEvolution(price, referenceEvolution);
    }
    if (!this.isActionPointReached(price, referenceEvolution)) {
      return this.makeNoActionEvolution(price, referenceEvolution);
    }
    if (this.canMakeNewGoal(price, referenceEvolution)) {
      return this.makeNewGoalEvolution(price, referenceEvolution);
    }
    return this.makeNoActionEvolution(price, referenceEvolution);
  }

  private isStartOfTime(referenceEvolution) {
    return !referenceEvolution;
  }

  private getReferenceEvolution(evolutions) {
    let referenceEvolution = evolutions[evolutions.length - 1];
    if (referenceEvolution) {
      referenceEvolution.goals = this.handleStatus(referenceEvolution.goals);
      referenceEvolution.ownedStocks = this.handleStatus(referenceEvolution.ownedStocks);
    }
    return referenceEvolution;

  }

  private handleStatus(goals) {
    let remainingStatus = goals.filter((goal) => goal.status !== 'deleted');
    return remainingStatus.map((goal: Goal) => {
      goal.status = '';
      return goal;
    });
  }

  private isActionPointReached(price, evolution: Evolution) {
    return price < evolution.actionPointDown || price > evolution.actionPointUp;
  }

  private makeNoActionEvolution(price, evolution: Evolution) {
    return new Evolution(price, evolution.goals, evolution.ownedStocks, evolution.cashflow, evolution.actionPointUp, evolution.actionPointDown);
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
    let newGoal = new Goal(price - this.getThreshold(price), true, 'new');
    let newGoals = evolution.goals.concat(newGoal);
    let newStocks = evolution.ownedStocks;
    let newCashflow = evolution.cashflow + price;
    newStocks[0].status = 'deleted';
    let actionDown = price - this.getThreshold(price);
    let actionUp = price + this.getThreshold(price);
    return new Evolution(price, newGoals, newStocks, newCashflow, actionUp, actionDown);
  }

  private makeGoalToSell(price, evolution) {
    let newGoal = new Goal(price + this.getThreshold(price), false, 'new');
    let newGoals = evolution.goals.concat(newGoal);
    let newStocks = evolution.ownedStocks.concat(new Stock(price, 'new'));
    let newCashflow = evolution.cashflow - price;
    let actionDown = price - this.getThreshold(price);
    let actionUp = price + this.getThreshold(price);
    return new Evolution(price, newGoals, newStocks, newCashflow, actionUp, actionDown);
  }

  private canMakeNewGoal(price, evolution: Evolution) {
    return this.canMakeGoalToSell(price, evolution) || this.canMakeGoalToBuy(price, evolution);
  }

  private canMakeGoalToSell(price, evolution: Evolution) {
    let conflictingGoalToSell = evolution.goals.find((goal: Goal) => {
      return goal.price > price + this.getThreshold(price) && goal.price < price + (this.getThreshold(price) * 2);
    });
    return !conflictingGoalToSell && !this.isTooManyStocks(evolution.ownedStocks);
  }

  private getThreshold(price) {
    return price * this.actionPoint;
  }

  private canMakeGoalToBuy(price, evolution: Evolution) {
    let existingGoalToBuy = evolution.goals.find((goal) => {
      return goal.price < price - this.getThreshold(price) && goal.price > price - (this.getThreshold(price) * 2);
    });
    return !existingGoalToBuy && evolution.ownedStocks.length > 1;
  }

  private isTooManyStocks(stocks) {
    return stocks.length >= this.stockPool;
  }

  private makeResolveGoalEvolution(price, evolution: Evolution) {
    let goal = this.getCompletableGoal(price, evolution.goals);
    let remainingGoals = this.getRemainingGoals(goal.price, evolution.goals);
    let remainingStocks = this.getStocks(evolution.ownedStocks, goal, price);
    let remainingCashflow = this.getCashflow(evolution.cashflow, goal, price);
    let actionDown = price - this.getThreshold(price);
    let actionUp = price + this.getThreshold(price);
    if (this.hasNoMoreStocks(remainingStocks)) {
      let deletedGoals = remainingGoals.map((goalToDelete) => {
        goalToDelete.status = 'deleted';
        return goalToDelete;
      });
      return new Evolution(price, deletedGoals, remainingStocks, remainingCashflow, actionUp, actionDown);
    }
    return new Evolution(price, remainingGoals, remainingStocks, remainingCashflow, actionUp, actionDown);
  }

  private hasNoMoreStocks(stocks) {
    let remainingStocks = stocks.filter((stock) => stock.status !== 'deleted');
    return remainingStocks.length === 0;
  }

  private getCashflow(originalCash, goal, price) {
    return goal.isBuy ? originalCash - price : originalCash + price;
  }

  private getStocks(stocks, goal: Goal, price) {
    if (goal.isBuy) {
      stocks.push(new Stock(price, 'new'));
      return stocks;
    }
    stocks[0].status = 'deleted';
    return stocks;
  }

  private getRemainingGoals(price, goals) {
    return goals.map((goal: Goal) => {
      if (goal.price === price) {
        goal.status = 'deleted';
      }
      return goal;
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

  private isGoalBuyButTooManyStocks(isBuy, stocks) {
    return isBuy && stocks.length >= this.stockPool;
  }

  private isGoalSellButNoStock(isBuy, stocks) {
    return !isBuy && stocks.length === 0;
  }

  private getCompletableGoal(price, goals): Goal {
    return goals.find((goal: Goal) => {
      return goal.isBuy ? goal.price >= price : goal.price <= price;
    });
  }
}
