import React from 'react';
// import methods from '../assets/methods.js';
import CardComponent from '../newindex/CardComponent.jsx';
import IconsComponent from '../newindex/IconsComponent.jsx';
import BannerComponent from '../newindex/BannerComponent.jsx';
import FourLineComponent from '../newindex/FourLineComponent.jsx';
import MoreComponent from '../newindex/MoreComponent.jsx';
require('../newindex/newindex.less');


export default class NewIndexComponet extends React.Component {
    constructor(props) {
        super(props);
    }


    getTarget(str){
    	var pool = {
            "small_card_bg_insurance":"08756749e99324fde2a8d1d41272a617675246272",
            "icon_health_insurance":"083e44469503d274d929c6f2116ff9ca0b4437301",
            "icon_car_insurance":"023e41469405d4742329c9f2135ff0c5043d86a78",
            "icon_property_insurance":"05756749e99324fde2a8d1d41242a61e6752f6272",
            "icon_more_insurance":"02756479e3952efd21a8d5d41c62af12639427267",
            "card_arrow":"",
            "default":"02756479e39525fd26a8d7d41662a412669427267"
        };
        var urlHead = 'https://ts.market.mi-img.com/thumbnail/jpeg/q80/Finance/';
        var imageId = "default";
        if(str){
            imageId =  str.split("/").reverse()[0];
        }
        if(pool[imageId]){
            imageId = pool[imageId];
        }
        return urlHead + imageId;
    }
    dataChaneg(list,type){
    	var self = this;
        list.map(function (el, index) {
            if(type == "banner"){
                el.image = self.getTarget(el.image);
            }else if(type == "icons"){
                el.icon = self.getTarget(el.icon);
            }
        })
        return list;
    }
    native2Web(){
    	var self = this;
    	var oriRes = self.props.res.body;
    	oriRes.map(function(el,index){
    		el.items.map(function(ele,ind){
    			switch (ele.type){
                    case "small_card":
                        ele.content.bg = self.getTarget(ele.content.bg);
                        break;
                    case "banner":
                        ele.content = self.dataChaneg(ele.content,"banner");
                        break;
                    case "icons":
                        ele.content = self.dataChaneg(ele.content,"icons");
                        break;
                    case "4line":
                        ele.content.icon = self.getTarget(ele.content.icon);
                        break;
                }
    		})
    	})
    	return oriRes;
    }

    render() {
        var self = this;
        var value = self.native2Web();
        return (
            <div className="newindex-wrap">
        		{value && value.map(function(el, index) {
                return (
                    <div className="newblock" key={index}>
	                    { el.title && <h2 className="index-title top-bl">{el.title}</h2>}
	                    {
	                    	el.items && el.items.map(function(item,ind){
	                    		var tag;
	                    		switch (item.type){
	                    			case "small_card":
	                    				tag = <CardComponent {...item.content} key={ind} />;
	                    				break;
	                    			case "icons":
	                    				tag = <IconsComponent {...item} key={ind} />;
	                    				break;

	                    			case "banner":
	                    				if(item.content.length>0){
	                    					tag = <BannerComponent {...item} key={ind} />
	                    				}
	                    				break;

	                    			case "4line":
	                    				tag = <div className="fourline-container" key={ind}>
                                                    <FourLineComponent {...item}/>
                                                </div>
	                    				break;
	                    			case "button":
	                    				tag = <MoreComponent {...item} key={ind} />
	                    				break;
	                    		}
	                    		return tag;
	                    	})
	                    }

					</div>
                )
            })}        	      		
				
			</div>

        )
    }

}