import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, Link } from 'react-router';
import methods from './assets/methods.js';
import Category from './category/category.jsx';
import CategoryContent from './category/CategoryContent.jsx';

methods.linkInterceptor();
export default class App extends React.Component {

    render() {
        console.log(this.props.children)
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
var routes = (
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="/category" component={Category}>
                <Route path="/category/:id" component={CategoryContent} />
            </Route>
        </Route>
    </Router>
);
ReactDOM.render(routes, document.getElementById('app'));
