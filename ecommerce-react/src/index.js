import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from './redux/reducers/reducer'
import { loadState, saveState } from './redux/sessionStorage'
import axios from 'axios';
import * as serviceWorker from './serviceWorker';
const persistedState = loadState();

let store = createStore(rootReducer, persistedState);
store.subscribe(() => {
  saveState(store.getState());
});

axios.interceptors.request.use(function (config) {
  if (sessionStorage.getItem('jwt') != null) {
    const token = 'Bearer '+ sessionStorage.getItem('jwt');
    config.headers.Authorization = token;
  }
  return config;
});
ReactDOM.render(
  <Provider store={store}>

    <App />
  </Provider>,
  document.getElementById('root')
);

  if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/firebase-messaging-sw.js');
        });
      }
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorker.unregister();