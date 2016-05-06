import {
  INCREMENT_COUNTER,
  DECREMENT_COUNTER,
  LOGOUT_USER
} from '../constants';
import { Map, fromJS } from 'immutable';


const INITIAL_STATE = fromJS({
  count: 0,
});

export type ICounter = Map<string, number>;

export function counterReducer(
  state: ICounter = INITIAL_STATE,
  action = { type: '' }) {

  switch (action.type) {

  case INCREMENT_COUNTER:
    return state.update('count', (value) => value + 1);

  case DECREMENT_COUNTER:
    return state.update('count', (value) => value - 1);

  case LOGOUT_USER:
    return state.merge(INITIAL_STATE);

  default:
    return state;
  }
}
