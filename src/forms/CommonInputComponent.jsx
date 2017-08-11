import React from 'react';
import methods from '../assets/methods.js';
export default class CommonInputComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {

        };
    }

    listen(val){
        var self = this;
        var valStr = val.trim();
        if(valStr.length == 0) return;
        if(self.props.regx.test(valStr)){
            var json = {}
            json[self.props.name] = valStr;
            this.props.setForms(json);
        }else{
            var json = {}
            json[self.props.name] = "";
            this.props.setForms(json);
            //提示
            self.formTips("请正确输入" + self.props.displayName);
        }
    }

    formTips(msg){
        this.props.formTips(msg);
    }
    //处理初始化
    componentDidMount() {
        var self = this;
        if(self.props.defaultValue){
            var json = {}
            json[self.props.name] = self.props.defaultValue;
            this.props.setForms(json);
        }
    }

    render(){
        var self = this;
        return (
            <li className="btm-bl">
                <label className="form-key">{self.props.displayName ? self.props.displayName : "缺少名字"}</label>
                <div className="form-inputbox">
                    <input type={self.props.inputType || "text"} placeholder={self.props.placeholder || "请输入"} defaultValue={this.props.defaultChooseValue} step="0.1" onBlur={(e) => {self.listen(e.target.value)}}/>
                </div>
            </li>
        )
    }
}