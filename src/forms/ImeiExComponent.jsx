import React from 'react';
import methods from '../assets/methods.js';
const tips = '请输入86开头的15位数字';
export default class ImeiExComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            imei: ''
        }
    }

    emitFn(imei) {
        var self = this;
        var json = {}
        json[self.props.name] = imei;
        self.props.setForms(json);
    }

    listen(e,type) {
        var self = this;
        var value = e.target.value.trim();
        if (value.length === 15 && self.props.regx.test(value)) {
            self.emitFn(value);
        } else if (value.length > 15) {
            self.emitFn('');
            self.props.formTips(tips)
        } else {
            self.emitFn('');
        }
        //失去焦点
        if(type && type === "blur"){
            if (!(value.length === 15 && self.props.regx.test(value))){
                self.props.formTips(tips)
            }
        }
        self.setState({
            imei: value
        })
    }

    componentDidMount() {
        var self = this;
        var imei = '';
        //先从url取值,没有然后去客户端取值,在没有置空
        if (localStorage.iMeiStr) {
            imei = localStorage.iMeiStr;
        } else if (window.MiFiJsInternal && MiFiJsInternal.getImei) {
            var id = MiFiJsInternal.getImei() || '';
            imei = self.props.regx.test(id) ? id : '';
        }
        self.setState({
            imei: imei
        }, function () {
            self.emitFn(imei);
        })
    }

    render() {
        return (
            <li className="btm-bl">
                <label className="form-key">{this.props.displayName}</label>
                <div className="form-inputbox">
                    <input type="number" value={this.state.imei} placeholder={this.props.placeholder || "请输入"} onChange={(e) => this.listen(e)} onBlur={(e) => this.listen(e,"blur")}/>
                </div>
            </li>
        )
    }
}
