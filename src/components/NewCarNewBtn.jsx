import React from 'react';
require("./NewCarNewBtn.less");
export default class CarNewBtn extends React.Component {
    constructor (props){
        super(props);
        this.state = {display:true};
    }
    componentDidMount(){}
    handleClick(e){
        if(!e.currentTarget.classList.contains('disabled')){
            if (e.currentTarget.classList.contains('inner-call')) {
                // //统计方法
                // MiFiLoantracker({
                //     pageTitle: '车险_保险_电话咨询_' + localStorage.productId,
                //     productType:"insurance"
                // });
            }
            if (e.currentTarget.classList.contains('right')) {
                this.props.onClick()
            }
        }
    }
    render() {
        var style={};
        if(this.state.display){
            style={}
        }else{
            style={WebkitTransform:'translateY(100px)'}
        }
        return (
            <div className="ins-new-car-button" >
                <div className="content top-border" style={style}>
                    <a className={"a left frame-btn-color"+this.props.class}>
                        {
                            this.props.preferential ? <span className="inner-call" onClick={(e)=>this.handleClick(e)}>
                                        <span className="percent">预先支付：<span className="aa">{this.props.premium + '元'}</span></span>
                                        <span className="per-intro">优惠价：<span className="aa">{this.props.realPremium + '元'}</span></span>
                                    </span> : <span className="inner-call" onClick={(e)=>this.handleClick(e)}>
                                        <span className="per-intro">优惠价：<span className="aa">{this.props.premium + '元'}</span></span>
                                    </span>
                        }
                    </a>
                    <div className={"a right frame-btn-color "+this.props.class} onClick={(e)=>this.handleClick(e)}>
                        <a href={this.props.url} title={this.props.title}>{this.props.value}</a>
                    </div>
                </div>
            </div>
        );
    }
}