import React from "react";
import methods from '../assets/methods.js';

export default class IconsComponent extends React.Component{
	constructor(props) {
        super(props);
    }

    handleClick(){
    	MiFiLoantracker({
            pageTitle: el.target.stat || '',
            productType: "insurance"
        });
        methods.newStartActivity({
            url:methods.replaceFrom(el.target.url),
            title:el.title || ''
        })
    }

    render(){
    	var self = this;
    	var iconList = self.props.content;

    	return (
    		<div className="icons-wrap btm-bl">
    			{
    				iconList && iconList.map(function(el,index){
    					return(
    						<a key={index} onClick={() => self.handleClick(el)} title={el.title}>
                                <img src={el.icon} alt="" />
                                <h6>{el.title}</h6>
                            </a>
    					)
    				})
    			}
    		</div>
    	)
    }
}