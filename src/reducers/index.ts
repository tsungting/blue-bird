import { combineReducers } from 'redux';
import counter from './counter';
import session from './session';
import { IAppState } from '../store';

export default combineReducers<IAppState>({
  counter,
  session
});
