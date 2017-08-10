import React from 'react';
require('./Modal.css');
/*
* <FullScreenNotice onClick={() => self.hideModal()} show={true}/>
* */
export default class FullScreenNotice extends React.Component {
    constructor(props){
        super(props);
    }
    handleClick(){
        this.props.onClick();
    }
    render() {
        return (
            <div className={this.props.show ? "fullscreen-wraper showModal" : "fullscreen-wraper"}>
                <div className="fullscreen-container">
                    <h2 className="fullscreen-tt ins-orange">系统故障</h2>
                    <div className="fullscreen-content">抱歉，由于系统故障,本产品暂时无法购买，工程师正在紧急修复中，对您带来的不便,请见谅~</div>
                </div>
            </div>
        );
    }
}


