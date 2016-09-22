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
        this.ngRedux.dispatch({
          type: TickerActions.NEW_EVOLUTION_CREATED,
          payload: evolution
        });
        this.ngRedux.dispatch({
          type: TickerActions.TICKER_UPDATED,
          payload: ticker
        });
      });
  }

  private getEvolution(price, evolutions:Array<Evolution>) {
    let evolution = evolutions[evolutions.length - 1];
    if (this.canCompleteGoal(evolution)) {
      return this.makeResolveGoalEvolution(evolution);
    }
    if (this.canMakeNewGoal(price, evolution)) {
      return this.makeNewGoalEvolution(price, evolution);
    }
  }

  private makeNewGoalEvolution(price, evolution){
    if (this.shouldMakeSaleGoal(price, evolution)){
      let newGoal = new Goal(price, false);
      evolution.goals.push(newGoal);
      return evolution;
    }
    if (this.shouldMakeBuyGoal(price, evolution)){
      let newGoal = new Goal(price, true);
      evolution.goals.push(newGoal);
      return evolution;
    }
  }

  private shouldMakeBuyGoal(price, evolution){
    let goalToBuy = evolution.goals.find((goal)=>{
      return goal === price + 1;
    });
    return !goalToBuy;
  }

  private shouldMakeSaleGoal(price, evolution){
    let goalToSell = evolution.goals.find((goal)=>{
      return goal === price + 1;
    });
    return !goalToSell;
  }

  private canMakeNewGoal(price, evolution) {
    let goalToSell = evolution.goals.find((goal)=>{
      return goal === price + 1;
    });
    let goalToBuy = evolution.goals.find((goal) => {
      return goal === price - 1 ;
    });
    return !(goalToSell && goalToBuy);
  }

  private makeResolveGoalEvolution(evolution:Evolution) {
    //get new goal
    let goal = this.getCompletableGoal(evolution.price, evolution.goals);
    let remainingGoals = this.getRemainingGoals(evolution.price, evolution.goals);
    let remainingStocks = this.getStocks(evolution.ownedStocks, goal, evolution.price);
    let remainingCashflow = this.getCashflow(evolution.cashflow, goal, evolution.price);
    return new Evolution(evolution.price, remainingGoals, remainingStocks, remainingCashflow);
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
      goal.price === price;
    });
  }

  private canCompleteGoal(evolution:Evolution) {
    if (!evolution){
      return false;
    }
    return !!this.getCompletableGoal(evolution.price, evolution.goals);
  }

  private getCompletableGoal(price, goals) {
    return goals.find((goal:Goal) => {
      goal.price === price;
    });
  }

}
