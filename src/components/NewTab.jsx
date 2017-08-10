import React from 'react';
require('./TabBar.css');

export default class TabBar extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    handleClick(e) {
        var st = e.target.getAttribute('role');
        this.props.onChange(st);
        var oParent = e.target.parentElement;
        var oChildren = oParent.children;
        for (var i = 0; i < oChildren.length; i++) {
            oChildren[i].className = '';
        }
        e.target.className = 'active';
    }

    render() {
        var self = this;
        return (
            <div className="tab-wraper btm-bl">
                <div className="tab-group" id="tab">
                    {
                        self.props.tabs.map(function (el, index) {
                            return (
                                <a key={index} onClick={(e) => {self.handleClick(e)}} role={el.role} className={index == 0 ? "active" : ""}>{el.name}</a>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
