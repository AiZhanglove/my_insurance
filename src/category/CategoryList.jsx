import React from 'react';
import methods from '../assets/methods.js';
require('./CategoryList.less');
export default class CategoryList extends React.Component {

    linkTo(e,el){
        var url= methods.baseUrl + "/insurance/" +e.currentTarget.getAttribute("data-href");
        var title = el.salesName;
        if(el.requireLogin){
            //跳转
            methods.commonLogin({
                callback:function(){
                    methods.startActivity(url, title)
                },
                failCallback:function(){}
            })
        }else{
            methods.startActivity(url, title)
        }
    }

    render() {
        var myfrom   = methods.getParam("from") || "local";
        var myurl    = "insurance.html?source=p0&from=" + myfrom + "#/";
        var frameUrl = "frame.html?source=p0&from=" + myfrom + "#/";
        var commonUrl = ".html?source=p0&from=" + myfrom + "#/";
        var imgHolder = "https://ts.market.mi-img.com/thumbnail/jpeg/q80/Finance/02756479e39525fd26a8d7d41662a412669427267";
        var noContentStyle={
            position: "fixed",
            left: 0,
            right:0,
            top:"40%",
            fontSize:"1.1666666666666667rem",
            textAlign: "center",
            color: "#999"
        }
        return (
            <div className="categorylist-container">
                <div className="category-body">
                    {
                        this.props.lists && this.props.lists .length > 0 ? this.props.lists.map(function (el, index) {
                            return (
                                <a key={index} data-href={ el.extraUrl ? el.extraUrl + commonUrl + el.url +"/" + el.id : myurl + el.url +"/" + el.id } href="javascript:;" onClick={(e) => this.linkTo(e,el)} className="category-list btm-bl">
                                    <div className="category-icon">
                                        <img src={el.iconUrl || imgHolder} alt=""/>
                                    </div>
                                    <div className="category-info">
                                        <h4>{el.salesName}</h4>
                                        <p>{el.intro}</p>
                                        <div className="">
                                            <strong className="price" style={el.lowerCase ? {} : {fontSize:"1.3333333333333333rem"}} dangerouslySetInnerHTML={{__html: el.upperCase}}></strong>
                                            <span className="sup" dangerouslySetInnerHTML={{__html: el.lowerCase}}></span>
                                        </div>
                                    </div>
                                    <span className="clearall"></span>
                                </a>
                            )
                        }.bind(this)) : !this.props.status && <div style={noContentStyle}>产品即将上线</div>

                    }
                </div>
            </div>
        )
    }
}

