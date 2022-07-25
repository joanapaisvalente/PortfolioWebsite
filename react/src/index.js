import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {callWebSocket} from './webSocket';
import { Provider } from 'react-redux'
import store from './redux/store'

callWebSocket(store.dispatch);

//provider a fazer referencia a store a todos os componentes dentro da app
ReactDOM.render(
  <Provider store={store}>
      <App />
  </Provider>,
  document.getElementById('root')
);

