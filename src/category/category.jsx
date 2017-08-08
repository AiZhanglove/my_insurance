import React from 'react'
import {Router, Route, hashHistory, Link } from "react-router";
require("./CategoryList.less");
export default class category extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            navs:[
                {
                    name:"全部",
                    id:"120"
                },
                {
                    name:"健康",
                    id:"115"
                },
                {
                    name:"意外",
                    id:"116"
                },
                {
                    name:"财产",
                    id:"117"
                },
                {
                    name:"旅行",
                    id:"111"
                }
            ]
        };
    }

    render() {
        var self = this;
        return (
            <div role="nav">
                <div className="nav btm-bl">
                    <ul role="nav" className="nav-inner">
                        {
                            self.state.navs.map(function (el, index) {
                                return (
                                    <li><Link to={"/category/" + el.id} className="inner-nav" activeClassName="current">{el.name}</Link></li>
                                )
                            })
                        }
                        <li><a href="./car.html?source=p0&from=local#/newcar/16" title="小米车险">车险</a></li>
                    </ul>
                </div>
                <div id="category-content">
                    {this.props.children}
                </div>
            </div>
        )
    }
}
