import React from 'react';
import ReactSwipe from 'react-swipe';
export default class BannerComponent extends React.Component{
	constructor(props){
		super(props);
	}

	thumbChange(list,index){
        for (var i = 0; i < list.length; i++) {
            list[i].className = "carousel-dot";
            list[index].className = "carousel-dot active";
        }
    }

	render(){
		var self = this;
        var json = this.props;
		var cfg = {
            continuous: true,
            wrapper: true,
            auto: 3000,
            callback: function (index, ele) {
                self.thumbChange(self.refs.thumb.children,index % json.content.length)
            }
        };
		return (
			<div id="focus-wrap" className="btm-bl top-bl">
				{
                    json.content.length > 1 ?
                        <div>
                            <ReactSwipe className="carousel" swipeOptions={cfg}>
                                {
                                    json.content.map(function (el, index) {
                                        return (
                                            <div key={index}><a className="banner-wrap" title={el.target.title} href={el.target.url}><img
                                                src={el.image}/></a></div>
                                        )
                                    })
                                }
                            </ReactSwipe>
                            <div className="thumb" ref="thumb">
                                {
                                    json.content.map(function (el, index) {
                                        return (
                                            <div key={index} className={index==0 ? "carousel-dot active" : "carousel-dot"}></div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        :
                        <a className="banner-wrap" href={json.content[0].target.url} title={json.content[0].target.title}><img src={json.content[0].image}/></a>
                }
			</div>
		)
	}
}
