import { Component, Input} from '@angular/core';
import { Evolution } from '../../types/evolution';
import { Goal } from '../../types/goal';

@Component({
  selector: 'bb-evolution-log',
  template: `
    <div class="clearfix" *ngFor="let evolution of evolutions">
        <div class="col col-2">
          <bb-label title="Price" [content]="evolution.price"></bb-label>
        </div>
        <div class="col col-3">
          <bb-label title="Remaining Stocks"></bb-label>
          <div *ngFor="let stock of evolution.ownedStocks">
            <span class="border inline">{{stock}}</span>
          </div>
        </div>
        <div class="col col-3">
          <bb-label title="Goals"></bb-label>
          <div *ngFor="let goal of evolution.goals">
            <span class="border inline">{{getGoalMessage(goal)}}</span>
          </div>
        </div>
        <div class="col col-2">
          <bb-label title="Cashflow" [content]="formatCashflow(evolution)"></bb-label>
        </div>
        <div class="col col-2">
          <bb-label title="Profitibility" [content]="getMarketValue(evolution)"></bb-label>
        </div>
      </div>
  `
})
export class BbEvolutionLog {
  @Input() evolutions: Array<Evolution> = [];

  private getMarketValue(evolution: Evolution) {
    let value = (evolution.price * evolution.ownedStocks.length) + evolution.cashflow;
    return `$ ${value.toFixed(2)}`;
  }

  private formatCashflow(evolution: Evolution) {
    return `$ ${evolution.cashflow.toFixed(2)}`;
  }

  private getGoalMessage(goal: Goal) {
    let action = goal.isBuy ? 'Buy ' : 'Sell ';
    return `${action} at ${goal.price.toFixed(2)}`;
  }
};

