import React from 'react';
require("./Button2.less");
export default class Head extends React.Component {
    constructor (props){
        super(props);
        this.state = {display:true};
    }
    componentDidMount(){}
    handleClick(e){
        if(!e.currentTarget.classList.contains('disabled')){
            this.props.onClick()
        }
    }
    render() {
        var style={};
        if(this.state.display){
            style={}
        }else{
            style={WebkitTransform:'translateY(100px)'}
        }
        return (
            <div className="ins-new-car-default-button" >
                <div className="content top-bl" style={style}>
                    <div className={"a frame-btn-color "+this.props.class} onClick={(e)=>this.handleClick(e)}>
                        <a href={this.props.url} title={this.props.title}>{this.props.value}</a>
                    </div>
                </div>
            </div>
        );
    }
}