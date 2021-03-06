import React from "react";
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute } from "react-router";

import methods from './assets/methods.js';
import FrameDetail from './frame/FrameDetail.jsx';
import Inform from './frame/Inform.jsx';
import FrameBuy from './frame/FrameBuy.jsx';

//链接拦截
methods.linkInterceptor();
export default class App extends React.Component{
	render(){
		return(
			<div>
				{this.props.children}
			</div>
		)
	}
}

var routes = (
	<Router history={hashHistory}>
		<Route path="/" component={App}>
			<Route path="detail/:id" component={FrameDetail}></Route>
			<Route path="inform/:id" component={Inform} />
			<Route path="buy/:id" component={FrameBuy} />
		</Route>
	</Router>
)
ReactDOM.render(routes,document.getElementById('app'));