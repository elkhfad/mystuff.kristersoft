import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './component/App/App';
import * as serviceWorker from './serviceWorker';

import './i18n';

import 'bootstrap/dist/css/bootstrap.min.css';

import '../src/styles/index.scss';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
