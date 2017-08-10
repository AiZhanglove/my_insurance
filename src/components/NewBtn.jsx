import React from 'react';
import methods from '../assets/methods.js';
require("../components/Button1.less");
export default class Head extends React.Component {
    constructor (props){
        super(props);
        this.state = {display:true};
    }
    handleClick(e){
        if(!e.currentTarget.classList.contains('disabled')){
            this.props.onClick()
        }
    }
    render() {
        var style={};
        if(this.state.display){
            style={}
        }else{
            style={WebkitTransform:'translateY(100px)'}
        }
        var arr = [];
        arr.push(<span key="0">{methods.fen2Yuan(this.props.lastPremium, 2)}</span>);
        arr.push(<del key="1">{methods.fen2Yuan(this.props.premium, 2)}</del>);
        return (
            <div className="ins-button" >
                <div className="content top-bl" style={style}>
                    <div className="fixed-price-btn ins-red">
                        <a className="ins-red">
                            {
                                this.props.lastPremium && this.props.lastPremium > 0 ? methods.fen2Yuan(this.props.lastPremium, 2) : methods.fen2Yuan(this.props.premium, 2)
                            }
                        </a>
                        <small className="smallsize">元</small>
                        {
                            this.props.lastPremium && this.props.lastPremium > 0 ? <del>{methods.fen2Yuan(this.props.premium, 2)}</del> : ''
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