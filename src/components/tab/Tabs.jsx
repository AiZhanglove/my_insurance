import React, { Component } from 'react';
import classNames from 'classnames';
import './Tabs.less';
/*
*  <Tabs currentId="2" onChange={(id)=>self.callback(id)}>
     <TabPane title="Tab1" tabId="1" >1</TabPane>
     <TabPane title="Tab2" tabId="2" >2</TabPane>
   </Tabs>
   @className Tabs 设置class可以用来更好的修改tabs的显示样式,这个跟下面的className 控制的范围不同,这个是整个组件都可以控制
*  @currentId 默认选中那个 如何不设置默认走第一个
*  @ title  tabbar的名字
*  @ tabId  标示对应关系
*  @onChange 点击tab切换的callback方法
*  @className 因为TabPane是公用的所以内容区没有设置样式,这个可以让你自行设置样式
* */
export default class Tabs extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            currentId: props.currentId || '1'
        };
    }

    handleClick(el) {
        let self = this;
        let tabId = el.props.tabId;
        if (tabId !== self.state.currentId) {
            self.setState(
                {
                    currentId: tabId
                },
                function() {
                    self.props.onChange && self.props.onChange(tabId);
                }
            );
        }
    }

    render() {
        let self = this;
        let {className,children,...other} = self.props;
        let outerCls = classNames({
            "ins-tabs__box":true,
            [className]:className
        });
        return (
            <div className={outerCls}>
                <div className="ins-tabs__tab btm-bl">
                    {children.map(function(el, index) {
                        let cls = classNames({
                            'ins-tabs__tab__single': true,
                            'ins-tabs__tab__active':
                                self.state.currentId == el.props.tabId
                        });
                        return (
                            <span
                                className={cls}
                                onClick={() => self.handleClick(el)}
                                key={index}>
                                {el.props.title}
                            </span>
                        );
                    })}
                </div>
                <div className="ins-tabs__pane_cont">
                    {children.map(function(el, index) {
                        let cls = classNames({
                            'ins-tabs__pane': true,
                            'ins-tabs__pane__active':
                                self.state.currentId == el.props.tabId
                        });
                        return (
                            <div key={index} className={cls}>
                                {el}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
