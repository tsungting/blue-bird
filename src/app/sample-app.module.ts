import {NgModule}      from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {TickerActions} from '../actions/ticker.actions';
import {TickerApi} from '../services/ticker-api';
import {
  DevToolsExtension,
  NgRedux
} from 'ng2-redux';
import {NgReduxRouter} from 'ng2-redux-router';
import {
  routing,
  appRoutingProviders
} from './sample-app.routing';
import {
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import {RioSampleApp} from './sample-app';
import {SessionActions} from '../actions/session.actions';
import {SessionEpics} from '../epics/session.epics';
import {
  RioAboutPage,
  RioCounterPage,
} from '../pages';
import {WebSimulationPage} from '../pages/web-simulation';
import {DashboardPage} from '../pages/dashboard.page';
import {NTierSimulationPage} from '../pages/n-tier-simulation';
import {WebAnalyzerPage} from '../pages/web-analyzer';
import {MultiStockAnalyzer} from '../pages/multi-stock-analyzer';
import {RioCounter} from '../components/counter/counter.component';
import {RioLoginModule} from '../components/login/login.module';
import {RioUiModule} from '../components/ui/ui.module';
import {RioNavigatorModule} from '../components/navigator/navigator.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    routing,
    CommonModule,
    RioLoginModule,
    RioUiModule,
    RioNavigatorModule
  ],
  declarations: [
    RioSampleApp,
    RioAboutPage,
    RioCounterPage,
    DashboardPage,
    NTierSimulationPage,
    WebSimulationPage,
    WebAnalyzerPage,
    MultiStockAnalyzer,
    RioCounter
  ],
  bootstrap: [
    RioSampleApp
  ],
  providers: [
    DevToolsExtension,
    FormBuilder,
    TickerApi,
    NgRedux,
    NgReduxRouter,
    appRoutingProviders,
    SessionActions,
    SessionEpics,
    TickerActions
  ]
})
export class RioSampleAppModule {
}
