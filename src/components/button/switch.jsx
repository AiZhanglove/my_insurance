import React, {Component} from 'react'
import classNames from 'classnames'
import './Button.less'

export default class Switch extends Component{
    constructor(props){
        super(props);
        this.state={
            open:false,
            disabled:false
        }
    }
    handleClick(e){
        e.stopPropagation();
        var disabled=this.state.disabled,
            open=this.state.open;
        if(!disabled){
            open=!open;
            this.setState({
                open:open
            });
            this.props.onClick && this.props.onClick(open,e.target);
        }
    }
    componentDidMount(){
        this.setState(this.props);
    }
    render(){
        const {open,disabled,className}=this.state;
        const status=open ? "open" : "close";
        const cls=classNames({
            'switch-btn':true,
            [`switch-btn-${status}`]: true,
            'switch-btn-disabled':disabled,
            [className]:className
        });
        return(
            <div className={cls} onClick={(e) => this.handleClick(e)}>
                <span></span>
            </div>
        )
    }
}