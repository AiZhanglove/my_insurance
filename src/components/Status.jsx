require("./Status.less");
import React from 'react';
export default class Status extends React.Component {
	render(){
		return (
			<div className="ins-result">
				<div className="ins-result-status">
					<div className={"img "+this.props.status}></div>
					<h2>{this.props.title}</h2>
					<div className="ins-gray">{this.props.desc}</div>
				</div>
			</div>
		)
	}
}
