import React from 'react';
import methods from '../assets/methods.js';
require("../forms/NewButton.less");
export default class NewButton extends React.Component {
    constructor (props){
        super(props);
        this.state = {display:true};
    }

    handleClick(e){
        if(!e.currentTarget.classList.contains('disabled')){
            this.props.onClick()
        }
    }

    //shouldComponentUpdate(nextProps) {
    //    return (nextProps.couponAmount !== this.props.couponAmount || nextProps.premium !== this.props.premium || nextProps.value !== this.props.value);
    //}

    render() {
        var self = this;
        var lastPremium = self.props.premium - self.props.couponAmount;
        return (
            <div className={this.props.hide ? "ins-new-button hide-newbtn" : "ins-new-button"}>
                <div className="content ins-new-fixed top-bl">
                    <div className="fixed-price-btn ins-red">
                        <a className="ins-red">
                            {
                                lastPremium > 0 ? methods.fen2Yuan(lastPremium, 2) : methods.fen2Yuan(0)
                            }
                        </a>
                        <small className="smallsize">元</small>
                        {
                            self.props.couponAmount && self.props.couponAmount > 0 ? <del>{methods.fen2Yuan(self.props.premium, 2)}</del> : ''
                        }
                    </div>
                    <div className={"a "+this.props.class} onClick={(e)=>this.handleClick(e)}>
                        <a href={this.props.url} title={this.props.title}>{this.props.value}</a>
                    </div>
                </div>
            </div>
        );
    }
}