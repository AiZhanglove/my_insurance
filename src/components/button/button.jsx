import React from 'react'
import classNames from 'classnames'

export default class Button extends React.Component{
    constructor(props){
        super(props);
    }
    handleClick(){
        e.stopPropagation();
        this.props.onClick && this.props.onClick();
    }
    render(){
        const {className,direction,text,icon,onClick, ...other} =this.props;
        const cls=classNames({
            'btn':true,
            [`btn-icon-${direction}`]:true,
            [className]:className
        })
        return(
            <div className={cls} onClick={()=>this.handleClick()} {...other}>
                <span>{text}</span>
                {icon}
            </div>
        )
    }
};
Button.defaultProps={
    direction:'right'
};