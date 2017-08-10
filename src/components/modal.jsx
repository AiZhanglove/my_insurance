import React from 'react';
import Button from './Button.jsx';
require('./Modal.css');
export default class Modal extends React.Component {
    constructor(props){
        super(props);
    }
    handleClick(){
        this.props.onClick();
    }
    render() {
        return (
           <div className={this.props.show == "true" ? "modal-wraper showModal" : "modal-wraper"}>
                <div className="modal-container">
                    <h2 className="modal-tt">{this.props.title}</h2>
                    <div className="modal-content" dangerouslySetInnerHTML={{__html:this.props.content}}></div>
                    <Button onClick={()=>this.handleClick()} className="graybtn">{this.props.btn ? this.props.btn : "我知道了"}</Button>
                </div>
           </div>
        );
    }
}


