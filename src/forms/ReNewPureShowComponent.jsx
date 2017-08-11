import React from 'react';
import methods from '../assets/methods';
export default class ReNewPureShowComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            txt:''
        };
    }

    componentDidMount() {
        var self = this;
        self.emitFn();
        //
        self.enumData();
    }

    emitFn(){
        var self = this;
        var json = {}
        json[self.props.name] = self.props.defaultValue;
        self.props.setForms(json);
    }

    enumData(){
        var self = this;
        switch (self.props.type){
            case "EFFECTIVE_DATE":
                var targetStamp = new Date().getTime() + (3600 * 1000 * 24) * self.props.displayValue;
                self.setState({
                    txt:methods.date(targetStamp)
                })
                break;
            case "BIRTHDAY":
                self.setState({
                    txt:methods.date(self.props.displayValue)
                })
                break;
            default:
                self.setState({
                    txt:self.props.displayValue
                })
        }
    }

    transfer(key){
        var diary = {
            "CHILDREN":"子女",
            "SPOUSE":"配偶",
            "SELF":"本人",
            "PARENT":"父母",
            "OTHER":"其他"
        }
        return diary[key]
    }

    render() {
        return (
            <li className="btm-bl">
                <label className="form-key">{this.props.displayName ? this.props.displayName : "请配置displayName"}</label>
                <div className="form-inputbox">
                    <span className="datepickerbar numdate gray-fe">{this.state.txt}</span>
                </div>
            </li>
        )
    }
}