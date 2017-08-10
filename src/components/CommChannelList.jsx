import React from 'react';
import methods from '../assets/methods.js';
require('./InsuranceList.css');
export default class InsuranceList extends React.Component {
    constructor(props) {
        super(props);
    }

    goto(res){
        var self = this;
        var myfrom = methods.getParam("from") || "local";
        var myurl = "./insurance.html?source=p0&from="+myfrom+"#/";
        myurl = myurl + res.url +"/" + res.id;
        methods.startActivity(myurl,res.salesName);
    }

    render () {
        return (
            <div className="insurancelist-container">
                <h2 className="insurancelist-head">精品推荐</h2>
                {
                    this.props.lists.length > 0 && this.props.lists.map(function (el,index) {
                        return (
                            <div className={index > 0 ? "insurancelist-item" : "insurancelist-item first-item"} key={index}>
                                <a href="javascript:;" onClick={() => this.goto(el)} title={el.salesName}>
                                    <img className="cover-img" src={"/images/insurance/insurance_cover"+el.id+".jpg"}/>
                                    <div className="insurancelist-wrap">
                                        <div className="left">
                                            <h4 className="insurancelist-title">{el.salesName} {el.minPrice == 0 ? <span className="ins-orange">(赠送)</span>  :""} </h4>
                                            <p className="insurancelist-desc">{el.intro}</p>
                                        </div>
                                        <div className="middle">
                                            <div className="price-box">
                                                <strong className="price">{el.minPrice > 0 ? methods.fen2Yuan(el.minPrice,2): <i>免费领取</i> }</strong>
                                                <span className="sup">{el.minPrice > 0 ? methods.periodUnit(el.payPeriod) : ""}</span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        )
                    }.bind(this))
                }
            </div>
        )
    }
}

