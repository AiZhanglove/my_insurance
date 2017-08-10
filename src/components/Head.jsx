import React from 'react';
require("./Head.less");
export default class Head extends React.Component {
  render() {
    return (
  	<div className="ins-head">
  		<h2><span className="num">50</span>万元<span className="right">小米定制</span></h2>
  		<div className="ins-white">最高保障额度</div>
  		<div className="desc">
  			<div className="left">
				<h4>21.65</h4>
				元/年起</div>
  			<div className="center">
				<h4>70</h4>
				种重大疾病保障</div>
  			<div className="right">
				<h4>100%</h4>
				赔付</div>
  		</div>
  	</div>
    );
  }
}