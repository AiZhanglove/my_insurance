import React, {Component} from 'react'
import './index.less'

export default class ListItem extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    handleClick(e){
        e.stopPropagation();
        this.props.onClick && this.props.onClick();
    }
    render(){
        const {left,content,right,onClick, ...other}=this.props;

        return(
            <div className="list-item" {...other} onClick={(e)=>this.handleClick(e)}>
                <div className="left">
                    {left ? left : ""}
                </div>
                <div className="content">
                    {content ? content : ""}
                </div>
                <div className="right">
                    {right ? right : ""}
                </div>
            </div>
        )
    }
}