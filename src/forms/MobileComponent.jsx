import React from 'react';
export default class MobileComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    listenMobile(val,type){
        let self = this;
        let str = val.trim();
        let reg = /^0?(1)[0-9]{10}$/;
        let json = {};
        if(str.length == 11){
            if(reg.test(str)){ //正确的
                json[self.props.name] = str;
                self.props.setForms(json)
            }else{
                self.formTips("手机号有误，请核实后重新输入。")
                json[self.props.name] = '';
                self.props.setForms(json)
            }
        }else if(str.length > 11){
            self.formTips("手机号位数有误，请核实后重新输入。")
            json[self.props.name] = '';
            self.props.setForms(json)
        }else{
            if(str.length && type == "blur"){
                self.formTips("手机号位数有误，请核实后重新输入。")
            }
            json[self.props.name] = '';
            self.props.setForms(json)
        }
    }

    formTips(msg){
        this.props.formTips(msg);
    }

    render(){
        return (
            <li className="btm-bl">
                <label className="form-key">手&ensp;&ensp;&ensp;&ensp;机</label>
                <div className="form-inputbox">
                    <input ref="name" type="tel" placeholder={this.props.placeholder || "请输入"}  defaultValue={this.props.defaultChooseValue} onBlur={(e) => {this.listenMobile(e.target.value,"blur")}} onChange={(e) => {this.listenMobile(e.target.value)}}/>
                </div>
            </li>
        )
    }
}