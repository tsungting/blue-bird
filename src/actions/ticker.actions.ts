import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';
import {TickerApi} from '../services/ticker-api';
import {Goal} from '../types/goal';
import {Evolution} from '../types/evolution';

@Injectable()
export class TickerActions {
  static TICKER_UPDATED = 'TICKER_UPDATED';
  static NEW_EVOLUTION_CREATED = 'NEW_EVOLUTION_CREATED';

  constructor(private ngRedux:NgRedux<IAppState>,
              private tickerApi:TickerApi,) {
  }

  public getTickerValue() {
    let state = this.ngRedux.getState();
    this.tickerApi.fetchCurrentPrice(state.ticker.currentTicker)
      .subscribe((ticker) => {
        let evolution = this.getEvolution(ticker, state.ticker.evolutions);
        if (evolution) {
          this.ngRedux.dispatch({
            type: TickerActions.NEW_EVOLUTION_CREATED,
            payload: evolution
          });
        }
        this.ngRedux.dispatch({
          type: TickerActions.TICKER_UPDATED,
          payload: ticker
        });
      });
  }

  private getEvolution(price, evolutions:Array<Evolution>) {
    let evolution = evolutions[evolutions.length - 1];
    console.log('price', price);
    console.log('goals', evolution.goals);
    console.log('stocks', evolution.ownedStocks);
    console.log('cashflow', evolution.cashflow);
    if (this.canCompleteGoal(price, evolution)) {
      return this.makeResolveGoalEvolution(price, evolution);
    }
    if (this.canMakeNewGoal(price, evolution)) {
      return this.makeNewGoalEvolution(price, evolution);
    }
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

  private canMakeNewGoal(price, evolution:Evolution) {
    return this.canMakeGoalToSell(price, evolution) || this.canMakeGoalToBuy(price, evolution);
  }

  private canMakeGoalToSell(price, evolution:Evolution) {
    let existingGoalToSell = evolution.goals.find((goal:Goal)=> {
      return goal.price === price + 1;
    });
    return !existingGoalToSell && !this.isTooManyStocks(evolution.ownedStocks);
  }

  private canMakeGoalToBuy(price, evolution:Evolution) {
    let existingGoalToBuy = evolution.goals.find((goal) => {
      return goal.price === price - 1;
    });
    return !existingGoalToBuy && evolution.ownedStocks.length > 0;
  }

  private isTooManyStocks(stocks) {
    return stocks.length > 2;
  }

  private makeResolveGoalEvolution(price, evolution:Evolution) {
    let goal = this.getCompletableGoal(price, evolution.goals);
    let remainingGoals = this.getRemainingGoals(price, evolution.goals);
    let remainingStocks = this.getStocks(evolution.ownedStocks, goal, price);
    let remainingCashflow = this.getCashflow(evolution.cashflow, goal, price);
    return new Evolution(price, remainingGoals, remainingStocks, remainingCashflow);
  }

  private getCashflow(originalCash, goal, price) {
    return goal.isBuy ? originalCash - price : originalCash + price;
  }

  private getStocks(stocks, goal:Goal, price) {
    if (goal.isBuy) {
      stocks.push(price);
      return stocks;
    }
    stocks.pop();
    return stocks
  }

  private getRemainingGoals(price, goals) {
    return goals.filter((goal) => {
      return goal.price !== price;
    });
  }

  private canCompleteGoal(currentPrice, evolution:Evolution) {
    if (!evolution) {
      return false;
    }
    return !!this.getCompletableGoal(currentPrice, evolution.goals);
  }

  private getCompletableGoal(price, goals) {
    return goals.find((goal:Goal) => {
      return goal.price === price;
    });
  }

}
