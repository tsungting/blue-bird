import 'reflect-metadata';
import 'core-js/es6';
import 'core-js/es7/reflect';
import '../shims/shims_for_IE';
import 'zone.js/dist/zone';
import 'ts-helpers';

import { enableProdMode, provide } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { APP_BASE_HREF } from '@angular/common/index';
import { NgRedux } from 'ng2-redux';

import { RioSampleApp } from './containers/sample-app';
import { SessionActions } from './actions/session';
import { CounterActions } from './actions/counter';
import { AUTH_PROVIDERS } from './services/auth/';
import { SERVER_PROVIDERS } from './services/server/';

declare let __PRODUCTION__: any;

if (__PRODUCTION__) {
  enableProdMode();
} else {
  require('zone.js/dist/long-stack-trace-zone');
}

bootstrap(RioSampleApp, [
  NgRedux,
  SessionActions,
  CounterActions,
  AUTH_PROVIDERS,
  SERVER_PROVIDERS,
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  provide(APP_BASE_HREF, { useValue: '/' })
]);
