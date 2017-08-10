import React from 'react';
require('./TabBar.css');

export default class TabBar extends React.Component {
    handleClick (e) {
        var st = e.target.getAttribute('role');
        console.log(st);
        this.props.onChange(st);
        var oParent = e.target.parentElement;
        var oChildren = oParent.children;
        for (var i = 0; i < oChildren.length; i++) {
            oChildren[i].className = '';
        }
        e.target.className = 'active';
    }
    render () {
        return (
            <div className="tab-wraper btm-bl">
                <div className="tab-group" id="tab">
                    <a onClick={(e) => this.handleClick(e)} role="current" className="active">当前保单</a>
                    <a onClick={(e) => this.handleClick(e)} role="history">历史保单</a>
                </div>
            </div>
        )
    }
}
