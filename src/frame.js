import React from "react";
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute } from "react-router";

import methods from './assets/methods.js';
import FrameDetail from './frame/FrameDetail.jsx';

//链接拦截
methods.linkInterceptor();
export default class App extends.Component{
	render(){
		return(
			<div>
				{this.props.children}
			</div>
		)
	}
}

var routes = (
	<Router>
		<Route path="/" component={App}>
			<Route path="detail/:id" component={FrameDetail}></Route>
		</Route>
	</Router>
)