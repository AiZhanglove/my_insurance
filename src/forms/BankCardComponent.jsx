import React from 'react';
export default class BankCardComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
    }

    listenEvent(val,type){
        var self = this;
        var str = val.trim();
        var reg = /^\d{12,28}$/;
        if(str.length >= 12 && str.length <=28){
            if(reg.test(str)){ //正确的
                var json = {}
                json[self.props.name] = str;
                self.props.setForms(json)
            }else{
                self.commonOperate();
            }
        }else if(str.length > 28){
            self.commonOperate();
        }else{
            if(str.length && type == "blur"){
                self.formTips(errorTips1)
            }
            var json = {};
            json[self.props.name] = '';
            self.props.setForms(json)
        }
    }

    commonOperate(){
        var self = this;
        var errorTips = "银行卡号位数有误，请核实后重新输入。";
        var json = {};
        self.formTips(errorTips);
        json[self.props.name] = '';
        self.props.setForms(json)
    }

    formTips(msg){
        this.props.formTips(msg);
    }

    render(){
        return (
            <li className="btm-bl">
                <label className="form-key">{this.props.displayName}</label>
                <div className="form-inputbox">
                    <input type="tel" placeholder={this.props.placeholder || "请输入"}  defaultValue={this.props.defaultChooseValue} onBlur={(e) => {this.listenEvent(e.target.value,"blur")}} onChange={(e) => {this.listenEvent(e.target.value)}}/>
                </div>
            </li>
        )
    }
}