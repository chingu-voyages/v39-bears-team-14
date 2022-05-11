import React from 'react';

import ReactDOM from 'react-dom';

import './index.css';
import 'assets/clear.css';
import 'assets/font.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.register();

if (module.hot && !window.frameElement) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(<NextApp />, document.getElementById('root'));
  });
}
