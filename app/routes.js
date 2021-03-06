/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import SearchPage from './containers/SearchPage';
import COIRunner from './containers/COIRunner';

export default () => (
  <App>
    <Switch>
      <Route path="/runner" component={COIRunner} />
      <Route path="/counter" component={CounterPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
