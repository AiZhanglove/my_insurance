import React from 'react'
import classNames from 'classnames'
import './Icon.less'

export default class Icon extends React.Component{
    constructor(props){
        super(props);
    }
    handleClick(e){
        e.stopPropagation();
        this.props.onClick && this.props.onClick();
    }
    render(){
        const {type,className, ...other}=this.props;
        const cls=classNames({
           'icon':true,
            [className]:className
        });
        return(
            <div className={cls} {...other} onClick={(e)=>this.handleClick(e)}></div>
        )
    }
}