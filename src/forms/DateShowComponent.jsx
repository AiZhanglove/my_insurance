import React from 'react';
import methods from '../assets/methods';
export default class DateShowComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var self = this;
        var json = {}
        var targetStamp = new Date().getTime() + (3600 * 1000 * 24) * self.props.beginDays;
        json[self.props.name] = targetStamp;
        self.props.setForms(json);
    }
    render(){
        return (
            <li className="btm-bl">
                <label className="form-key">{this.props.displayName ? this.props.displayName : "出生日期"}</label>
                <div className="form-inputbox">
                    <span className="datepickerbar numdate" >{methods.date(new Date().getTime() + (3600 * 1000 * 24) * this.props.beginDays)}</span>
                </div>
            </li>
        )
    }
}
