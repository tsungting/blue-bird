import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';
import {TickerApi} from '../services/ticker-api';
import {Goal} from '../types/goal';
import {Evolution} from '../types/evolution';
import {AlgorithmParameters} from '../types/algorithm-parameters';
import {AnalysisAggregate} from '../types/analysis-aggregate';
import {AnalysisResult} from '../types/analysis-result';

import {RandomTickerEvolutionGenerator} from '../services/random-ticker-evolution-generator';
import {WebTickerEvolutionGenerator} from '../services/web-ticker-evolution-generator';

@Injectable()
export class TickerActions {
  static TICKER_UPDATED = 'TICKER_UPDATED';
  static NEW_EVOLUTION_CREATED = 'NEW_EVOLUTION_CREATED';
  static WEB_REQUEST_STARTED = 'WEB_REQUEST_STARTED';
  static NEW_WEB_EVOLUTION_CREATED = 'NEW_WEB_EVOLUTION_CREATED';
  static NEW_ANALYSIS_RESULT_CREATED = 'NEW_ANALYSIS_RESULT_CREATED';
  static NOT_FOUND_RECEIVED = 'NOT_FOUND_RECEIVED';
  static MULTI_STOCK_ANALYSIS_RESULT_CREATED = 'MULTI_STOCK_ANALYSIS_RESULT_CREATED';
  static NEW_STOCK_LIST_CREATED = 'NEW_STOCK_LIST_CREATED';

  constructor(private ngRedux: NgRedux<IAppState>,
              private tickerApi: TickerApi) {
  }

  public getTickerValue() {
    let state = this.ngRedux.getState();
    this.tickerApi.fetchNextRandomPrice(state.ticker.get('currentTicker'))
      .subscribe((ticker) => {
        state = this.ngRedux.getState();
        let generator = new RandomTickerEvolutionGenerator();
        let evolution = generator.getEvolution(ticker, state.ticker.get('evolutions').toJS());
        if (evolution) {
          this.dispatch(evolution, TickerActions.NEW_EVOLUTION_CREATED);
        }
        this.dispatchTicker(ticker);
      });
  }

  public getWebEvolutions(symbol = 'FB', actionPoint = '0.05', stockPool = '3') {
    this.ngRedux.dispatch({
      type: TickerActions.WEB_REQUEST_STARTED,
      payload: {symbol: symbol}
    });
    this.tickerApi.fetchHistoryFor(symbol)
      .subscribe((ticker) => {
        let state = this.ngRedux.getState();
        let generator = new WebTickerEvolutionGenerator(actionPoint, stockPool);
        let evolution = generator.getEvolution(ticker, state.ticker.get('webEvolutions').toJS());
        if (evolution) {
          this.dispatch(evolution, TickerActions.NEW_WEB_EVOLUTION_CREATED);
        }
        this.dispatchTicker(ticker);
      });
  }

  public analyzeStock(symbol = 'FB', actionPoint = '0.05', stockPool = '3') {
    this.dispatch({symbol: symbol}, TickerActions.WEB_REQUEST_STARTED);
    this.tickerApi.fetchFullHistoryFor(symbol)
      .subscribe((tickers) => {
        let queryInfo = this.getQueryInfo(symbol, actionPoint, stockPool);
        let result = this.analyzeSingleStock(tickers, queryInfo);
        this.dispatch(result, TickerActions.NEW_ANALYSIS_RESULT_CREATED);
      }, (error) => {
        if (error.status === 404) {
          this.dispatch(error, TickerActions.NOT_FOUND_RECEIVED);
        }
      });
  }

  public analyzeMultiStock(page = '1', actionPoint = 0.01, stockPool = 3, filterPriceIfBiggerThan = '0') {
    this.dispatch({}, TickerActions.WEB_REQUEST_STARTED);
    this.fetchMultiStockHistory(page)
      .subscribe((tickerPrices: Array<any>) => {
        let newPrices = tickerPrices.filter((price) => this.filterPrice(price, filterPriceIfBiggerThan));
        let results = newPrices.map((singleTickerPrices) => {
          return this.analyzeSingleStock(singleTickerPrices, new AlgorithmParameters('N/A', stockPool, actionPoint));
        })
          .filter((result) => result);
        let averagedResults = results.reduce((currentAverage: AnalysisAggregate, result: AnalysisResult) => {
          currentAverage.averageStockHeld += result.averageStockHeld / results.length;
          currentAverage.referenceGain += result.referenceGain / results.length;
          currentAverage.percentageGain += result.percentageGain / results.length;
          currentAverage.totalStocksAnalyzed += 1;
          currentAverage.totalWinOverReference += result.percentageGain > result.referenceGain ? 1 : 0;
          return currentAverage;
        }, new AnalysisAggregate());
        averagedResults.queryInfo = new AlgorithmParameters('N/A', stockPool, actionPoint, page);
        this.dispatch(averagedResults, TickerActions.MULTI_STOCK_ANALYSIS_RESULT_CREATED);
      });
  }

  private filterPrice(tickerPrices, threshold) {
    let minMax = tickerPrices.reduce((currentMinMax, tickerPrice) => {
      if (tickerPrice < currentMinMax.min) {
        return {min: tickerPrice, max: currentMinMax.max};
      }
      if (tickerPrice > currentMinMax.max) {
        return {min: currentMinMax.min, max: tickerPrice};
      }
      return currentMinMax;
    }, {min: 999, max: 0});
    return minMax.min / minMax.max < (1 - threshold);
  }

  // Doing this optimization changes load from 16s to 10s
  private fetchMultiStockHistory(page = '1') {
    let state = this.ngRedux.getState();
    let stockListInStore = state.ticker.getIn(['stockList', page]);
    if (!stockListInStore) {
      return this.tickerApi.fetchStockList(page)
        .flatMap((list) => {
          this.dispatch({page: page, list: list}, TickerActions.NEW_STOCK_LIST_CREATED);
          return this.tickerApi.fetchStockForSymbols(list);
        });
    }
    return this.tickerApi.fetchStockForSymbols(stockListInStore.toJS());

  }

  private analyzeSingleStock(prices, queryInfo: AlgorithmParameters) {
    if (!prices.length) {
      return;
    }
    let generator = new WebTickerEvolutionGenerator(queryInfo.actionPoint.toString(), queryInfo.pool.toString());
    let evolutions = prices.reduce((currentEvolutions, ticker) => {
      let newEvolution = generator.getEvolution(ticker, JSON.parse(JSON.stringify(currentEvolutions)));
      return currentEvolutions.concat(newEvolution);
    }, []);
    let result: AnalysisResult = this.analyzeEvolutions(evolutions);
    result.queryInfo = queryInfo;
    return result;
  }

  private getQueryInfo(symbol, actionPoint, stockPool) {
    return new AlgorithmParameters(symbol, stockPool, actionPoint);
  }

  private analyzeEvolutions(evolutions) {
    let daysInPeriod = evolutions.length;
    if (daysInPeriod === 0) {
      return;
    }
    let result: AnalysisResult = evolutions.reduce((currentResult: AnalysisResult, evolution: Evolution) => {
      if (evolution.profit > currentResult.maximumProfit) {
        currentResult.maximumProfit = evolution.profit;
      }
      if (evolution.profit < currentResult.minimumProfit) {
        currentResult.minimumProfit = evolution.profit;
      }
      if (evolution.cashflow < currentResult.minimumCashflow) {
        currentResult.minimumCashflow = evolution.cashflow;
      }
      currentResult.averageStockHeld += this.getRemainingStocks(evolution.ownedStocks) / daysInPeriod;
      return currentResult;
    }, new AnalysisResult());
    let finalEvolution = evolutions[evolutions.length - 1];
    result.endProfit = finalEvolution.profit;
    result.startPrice = evolutions[0].price;
    result.endPrice = finalEvolution.price;
    result.percentageGain = result.endProfit / (evolutions[0].price * result.averageStockHeld);
    if (isNaN(result.percentageGain)) {
      result.percentageGain = 0;
    }
    result.referenceGain = (finalEvolution.price - evolutions[0].price) / evolutions[0].price;
    return result;
  }

  private getRemainingStocks(stocks) {
    return stocks.filter((stock) => stock.status !== 'deleted').length;
  }

  private dispatch(evolution, name) {
    this.ngRedux.dispatch({
      type: name,
      payload: evolution
    });
  }

  private dispatchTicker(ticker) {
    this.ngRedux.dispatch({
      type: TickerActions.TICKER_UPDATED,
      payload: ticker
    });
  }

}
