import React from 'react';
import methods from '../assets/methods.js';

export default class FourLineComponent extends React.Component{
	constructor(props){
		super(props)
	}

	linkTo(el){
        //统计
        MiFiLoantracker({
            pageTitle: el.target.stat,
            productType: "insurance"
        });
        //跳转
        if(el.target.loginRequired && window.MiFiJsInternal){
            methods.commonLogin({
                callback:function(){
                    methods.newStartActivity({
                        url:methods.replaceFrom(el.target.url),
                        title:el.target.title
                    })
                },
                failCallback:function(){}
            })
        }else{
            methods.newStartActivity({
                url:methods.replaceFrom(el.target.url),
                title:el.target.title
            })
        }
    }

	render(){
		var el = this.props.content;
		return (
			<div className="fourline-wrap">
				{
                    <a className="top-bl category-list" onClick={() => this.linkTo(el)} data-href={el.target.url} title={el.target.title}>
                        <div className="category-icon">
                            <img src="https://ts.market.mi-img.com/thumbnail/png/q80/Finance/02756479e39525fd26a8d7d41662a412669427267" data-src={el.icon} alt="" />
                        </div>
                        <div className="category-info">
                            <h4>{el.title}</h4>
                            <p>{el.subtitle}</p>
                            <div className="price" dangerouslySetInnerHTML={{__html: el.detail}}></div>
                        </div>
                        <span className="clearall"></span>
                    </a>
                }
			</div>
		)
	}
}