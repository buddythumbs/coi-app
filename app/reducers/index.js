// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import search from './search';
import tools from './tools';
import config from './config';
import coi from './coi';

const rootReducer = combineReducers({
  counter,
  router,
  config,
  search,
  tools,
  coi
});

export default rootReducer;
