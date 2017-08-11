import React from 'react';
import methods from '../assets/methods.js';
export default class EmailComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            value:props.defaultValue || ""
        };
    }

    listenName(val){
        var self = this;
        var emailStr = val.trim();
        if(methods.regex.email.test(emailStr)){ //邮件正则验证
            var json = {}
            json[self.props.name] = emailStr;
            this.props.setForms(json);
        }else{
            var json = {}
            json[self.props.name] = "";
            this.props.setForms(json);
            //提示
            self.formTips("输入的邮箱格式不正确");
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
        return (
            <li className="btm-bl">
                <label className="form-key">{this.props.displayName ? this.props.displayName : "电子邮箱"}</label>
                <div className="form-inputbox">
                    <input type="email" placeholder={this.props.placeholder || "请输入"}  defaultValue={this.props.defaultChooseValue} onBlur={(e) => {this.listenName(e.target.value)}}/>
                </div>
            </li>
        )
    }
}