import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { IPayloadAction, SessionActions } from '../actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import * as Rx from 'rxjs/Rx';

const moment = require('moment');
const BASE_URL = '/api';

@Injectable()
export class TickerApi {
  constructor(private http: Http) {
  }

  public fetchPricesForLevels(levels: number, currentPath = [100]) {
    let tree = [];
    this.addLevelsToTree(levels, currentPath, tree);
    return tree;
  }

  private addLevelsToTree(levels: number, currentPath = [100], tree = []) {
    if (levels > 0) {
      let currentPrice = currentPath[currentPath.length - 1];
      this.addLevelsToTree(levels - 1, currentPath.concat(currentPrice - 1), tree);
      this.addLevelsToTree(levels - 1, currentPath.concat(currentPrice + 1), tree);
      return;
    }
    tree.push(currentPath);
  }

  public fetchNextRandomPrice(previousPrice) {
    return Rx.Observable.from([1])
      .map((response) => this.transformTicker(previousPrice));
  }

  private transformTicker(previousPrice) {
    let nextPrice = previousPrice + this.getIncrement();
    if (nextPrice < 1) {
      return 2;
    }
    return nextPrice;
  }

  private getIncrement() {
    let increment = Math.round(Math.random());
    if (increment === 0) {
      return -1;
    }
    return 1;
  }

  public fetchHistoryFor(symbol) {
    return this.getRequestToGet(symbol)
      .map((result) => result.json())
      .flatMap((result) => this.splitEachDataPoint(result));

  }

  public fetchFullHistoryFor(symbol) {

    return this.getRequestToGet(symbol)
      .map((result) => result.json())
      .map((result) => {
        let dateIndex = result.dataset.column_names.indexOf('Date');
        result.dataset.data.sort(this.sortByDate(dateIndex));
        let closingPriceIndex = result.dataset.column_names.indexOf('Close');
        return result.dataset.data.map((data) => {
          return data[closingPriceIndex];
        });
      });
  }

  public fetchStockList(page = '1') {
    return this.http.get(`https://www.quandl.com/api/v3/datasets.json?database_code=WIKI&per_page=100&sort_by=id&page=${page}&api_key=9__kYHwVh4nsuTsQTSNF`, {
      headers: this.getHeaders()
    })
      .map((result) => result.json())
      .map((result) => {
        return result.datasets.map((symbolObject) => {
          return symbolObject.dataset_code;
        });
      });
  }

  public fetchStockForSymbols(symbols: Array<string>) {
    let requests = symbols.map((symbol) => this.fetchFullHistoryFor(symbol));
    return Observable.forkJoin(requests);
  }

  private getRequestToGet(symbol) {
    return this.http.get(`https://www.quandl.com/api/v3/datasets/WIKI/${symbol}.json?api_key=9__kYHwVh4nsuTsQTSNF&start_date=2015-01-01&end_date=2015-12-31`, {
      headers: this.getHeaders()
    });
  }

  private getHeaders() {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    return headers;
  }

  private splitEachDataPoint(result) {
    let closingPriceIndex = result.dataset.column_names.indexOf('Close');
    let dateIndex = result.dataset.column_names.indexOf('Date');
    result.dataset.data.sort(this.sortByDate(dateIndex));
    return Rx.Observable.timer(1, 1)
      .take(result.dataset.data.length)
      .map((index) => {
        let data = result.dataset.data[index];
        return data[closingPriceIndex];
      });
  }

  private sortByDate(dateIndex) {
    return (data1, data2) => {
      return moment(data1[dateIndex]).diff(moment(data2[dateIndex]));
    };
  }

}
