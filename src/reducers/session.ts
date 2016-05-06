import {
  LOGIN_USER_PENDING,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  LOGOUT_USER,
} from '../constants';

import { Map, fromJS } from 'immutable';

const INITIAL_STATE = fromJS({
  token: null,
  user: {},
  hasError: false,
  isLoading: false,
});

export type ISession = Map<string, any>;

export function sessionReducer(
  state: ISession = INITIAL_STATE,
  action: any = {type: ''}) {

  switch (action.type) {

  case LOGIN_USER_PENDING:
    return state.merge(fromJS({
      token: null,
      user: {},
      hasError: false,
      isLoading: true,
    }));

  case LOGIN_USER_SUCCESS:
    return state.merge(fromJS({
      token: action.payload.token,
      user: action.payload.profile,
      hasError: false,
      isLoading: false,
    }));

  case LOGIN_USER_ERROR:
    return state.merge(fromJS({
      hasError: true,
      isLoading: false,
    }));

  case LOGOUT_USER:
    return state.merge(INITIAL_STATE);

  default:
    return state;
  }
}
