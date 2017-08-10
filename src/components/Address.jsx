import React from 'react';
require('./Address.less');
window.mapdta = require('./map.js');
export default class Address extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            lists:mapdta
        };
        window.adds = []
    }

    handleClick(data){
        var self = this;
        window.adds.push(data.name);
        if(data.child && data.child.length>0){
            self.setState({
                lists:data.child
            })
        }else{
            self.brodcast(window.adds.join(""));
            window.adds = [];
            self.setState({
                lists:mapdta
            })
        }
    }

    closeclick(){
        this.props.onClick(false);
    }

    brodcast(res){
        this.props.onClick(res);
    }

    render() {
        var self = this;
        return (
            <div className={ this.props.show == "true" ? "address-container showaddress" : "address-container"} >
                <div className="address-box">
                    <span className="address-close" onClick={() => this.closeclick()}>&times;</span>
                    <h4>请选择所在地区</h4>
                    <ul>
                        {
                            self.state.lists.map(function (el,index) {
                                return (<li onClick={() => {self.handleClick(el)}} key={index}>{el.name}</li>)
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}