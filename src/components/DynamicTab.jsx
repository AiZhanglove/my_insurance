import React from 'react';
import methods from '../assets/methods.js';

export default class DynamicTab extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    bindTab(el){
        this.filterList();
        el.isOpen = 1;
        //传出去
        if(this.props.isPremium){
            this.props.callTab({
                premium:parseInt(el.premium),
                sumInsured:el.sumInsured
            })
        }else{
            this.props.callTab({
                sumInsured:el.sumInsured
            })
        }
    }

    filterList(){
        this.props.newtabs.forEach(function (el) {
            el.isOpen = 0;
        })
    }

    render() {
        var self = this;
        var classlists = "";
        return (
            <div className="resposive-tab btm-bl ins-border">
                <div className="resposive-tabbar">
                    {
                        self.props.newtabs.map(function (el, index) {
                            el.isOpen ? el.hot ? classlists = "active hot" : classlists = "active" : el.hot ? classlists = "hot" : classlists = "";
                            return (
                                <a href="javascript:;" key={index} className={classlists}
                                   onClick={() => {self.bindTab(el)} }>
                                    <h6>{el.title}</h6>
                                    <span>{el.insured}</span>
                                </a>
                            )
                        })
                    }
                </div>
                <div className="resposive-tabcon">
                    {
                        self.props.newtabs.length > 0 ? self.props.children.map(function (el, index) {
                            var mystyle = {};
                            var ele = self.props.newtabs[index];
                            ele.isOpen ? mystyle = {height: "auto", overflow: "hidden"} : mystyle = {
                                height: "0",
                                overflow: "hidden"
                            };
                            return (
                                <div key={index} style={mystyle} className="resposive-tabinfo">
                                    {el}
                                </div>
                            )
                        }) : ''
                    }
                </div>
            </div>
        )
    }
}
