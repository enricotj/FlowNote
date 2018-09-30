import React from 'react';
import ReactDOM from 'react-dom';
import {Redirect, Route, BrowserRouter } from "react-router-dom";
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Login from "./features/Login";

const Root = () => (
	<BrowserRouter>
		<div>
			<Route path="/login" component={Login}/>
			{/* <Route path="/app/home" component={Home}/> */}
			<Redirect from="/" to="/login"/>
		</div>
	</BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
