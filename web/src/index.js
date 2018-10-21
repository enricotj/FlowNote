import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom'
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

// Redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import reducer from "./reducers";
import promise from "redux-promise-middleware";

const middleware = applyMiddleware(promise(), thunk, logger);
const store = createStore(reducer, middleware);

ReactDOM.render((
	<Provider store={store}>
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</Provider>
	), document.getElementById('root'));
registerServiceWorker();
