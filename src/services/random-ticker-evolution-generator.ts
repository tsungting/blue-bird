import {Goal} from '../types/goal';
import {Evolution} from '../types/evolution';
import {Stock} from '../types/stock';

export class RandomTickerEvolutionGenerator {
  public getEvolution(price, evolutions: Array<Evolution>) {
    let referenceEvolution = this.getReferenceEvolution(evolutions);
    if (this.canCompleteGoal(price, referenceEvolution)) {
      return this.makeResolveGoalEvolution(price, referenceEvolution);
    }
    if (this.canMakeNewGoal(price, referenceEvolution)) {
      return this.makeNewGoalEvolution(price, referenceEvolution);
    }
    return this.makeNoActionEvolution(price, referenceEvolution);
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
    let newGoal = new Goal(price - 1, true, 'new');
    let newGoals = evolution.goals.concat(newGoal);
    let newStocks = evolution.ownedStocks;
    newStocks[0].status = 'deleted';
    let newCashflow = evolution.cashflow + price;
    return new Evolution(price, newGoals, newStocks, newCashflow);
  }

  private makeGoalToSell(price, evolution) {
    let newGoal = new Goal(price + 1, false, 'new');
    let newGoals = evolution.goals.concat(newGoal);
    let newStocks = evolution.ownedStocks.concat(new Stock(price, 'new'));
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
    let remainingGoals = this.getRemainingGoals(goal.price, evolution.goals);
    let remainingStocks = this.getStocks(evolution.ownedStocks, goal, price);
    let remainingCashflow = this.getCashflow(evolution.cashflow, goal, price);
    return new Evolution(price, remainingGoals, remainingStocks, remainingCashflow);
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

  private isGoalSellButNoStock(isBuy, stocks) {
    return !isBuy && stocks.length === 0;
  }

  private getCompletableGoal(price, goals): Goal {
    return goals.find((goal: Goal) => {
      return goal.price === price;
    });
  }
}
