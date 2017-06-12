import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as colors from './store/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const store = configureStore();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: colors.primary,
    primary2Color: colors.cursor,
    primary3Color: colors.info,
    accent1Color: colors.success,
    accent2Color: colors.gray,
    accent3Color: colors.danger,
    textColor: colors.gray,
    alternateTextColor: colors.info,
    canvasColor: '#fff',
    borderColor: colors.gray,
    disabledColor: '#ccc',
    pickerHeaderColor: colors.cursor,
    clockCircleColor: colors.primary,
    shadowColor: '#000',
  },
})

injectTapEventPlugin();
render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>
  </MuiThemeProvider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <MuiThemeProvider muiTheme={muiTheme}>
        <AppContainer>
          <NextRoot store={store} history={history} />
        </AppContainer>
      </MuiThemeProvider>,
      document.getElementById('root')
    );
  });
}
