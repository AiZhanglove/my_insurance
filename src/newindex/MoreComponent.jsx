import React from 'react';
import methods from '../assets/methods.js';

export default class MoreComponent extends React.Component{
	constructor(props){
		super(props)
		
	}

	gotoTarget(json){
        MiFiLoantracker({
            pageTitle: 'ins_more',
            productType: 'insurance'
        });
        methods.newStartActivity({
            url:methods.replaceFrom(json.target.url),
            title:json.target.title || ''
        })
    }

	render(){
		var json = this.props.content;
		return (
			<a href="javascript:;" onClick={() => this.gotoTarget(json)} className="more-btn top-bl" dangerouslySetInnerHTML={{__html: json.action}} title={json.target.title}></a>
		)
	}
}