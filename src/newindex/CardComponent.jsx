import React from 'react';
import methods from '../assets/methods.js';

export default class CardComponent extends React.Component{
	constructor(props){
		super(props)
	}

	transfer(res){
        return res.replace(/mifi.resource:\/\/image\/card_arrow/,'https://ts.market.mi-img.com/thumbnail/png/q80/Finance/0e78ec4dc643e449310cb5ce0d58fe40fe294d56e');
    } 
	render(){
		var json = this.props;
		
		return(
			<div className="card-wrap top-bl">
				<a title={json.target.title} href={methods.replaceFrom(json.target.url)}>
                    <img className="card-bg" src={json.bg}/>
                    <div className="card-wrap-inner">
                        <div className="card-btm_left">
                            <h2 dangerouslySetInnerHTML={{__html: json.tlTitle}}></h2>
                            <div className="clearfix">
                                <b dangerouslySetInnerHTML={{__html: this.transfer(json.trSubtitle)}}></b>
                                <h6 dangerouslySetInnerHTML={{__html: json.tlSubtitle}}></h6>
                            </div>
                        </div>
                    </div>
                </a>
			</div>
		)
	}
}