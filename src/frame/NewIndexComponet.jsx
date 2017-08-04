import React from 'react';
import methods from '../assets/methods.js';
require('../newindex/newindex.less');


export default class NewIndexComponet extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var self = this;
        console.log(self.props.res);
        var value = self.props.res.body;
        return (
            <div className="newindex-wrap">
        		{value && value.map(function(el, index) {
                return (
                    <div className="newblock" key={index}>
                    { el.title && <h2 className="index-title top-bl">{el.title}</h2>}
                    {
                    	el.items && el.items.map(function(item,ind){
                    		var tag = '';
                    		switch (item.type){
                    			case "small_card"
                    				tag = {<div key={ind}>这是small_card</div>}
                    				break;
                    			case "icons"
                    				tag = '<div>这是icons</div>';
                    				break;

                    			case "banner"
                    				tag = '<div>这是banner</div>';
                    				break;

                    			case "4line"
                    				tag = '<div>这是4line</div>';
                    				break;
                    			case "button"
                    				tag = '<div>这是button</div>';
                    				break;
                    		}
                    		return (tag);
                    	})
                    }

</div>
                )
            })}
        		<div>这是头部</div>
				<div>这是icon</div>
				<div>这是banner</div>
				<div>
					<h2>列表title</h2>
					<ul>
						<li>列表内容</li>
					</ul>
				</div>
				
			</div>

        )
    }

}