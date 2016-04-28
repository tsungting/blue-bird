import {Map} from 'immutable';

export interface IAppState {
  counter: Map<string, number>;
  session: Map<string, any>;
};
