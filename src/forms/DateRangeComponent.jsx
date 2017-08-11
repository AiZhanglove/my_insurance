import React from 'react';
import methods from '../assets/methods';
export default class DateRangeComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            value:props.defaultValue ? props.defaultValue : 0
        }
    }

    chooseDate(e){
        var self=this;
        var date = new Date();
        var dayLong = 3600 * 1000 * 24 ;
        var iNow = date.getTime();
        var min = iNow + dayLong * parseInt(self.props.beginDays);
        var max = iNow + dayLong * parseInt(self.props.endDays);
        methods.datePicker({
            minDate:min,
            maxDate:max,
            initDate:self.state.value ? self.state.value : min,
            callback:function(timestamp){
                var json = {};
                json[self.props.name] = timestamp;
                self.props.setForms(json);
                self.setState({
                    value:timestamp
                })
            }
        })
    }
    //初始化选择
    componentDidMount() {
        var self = this;
        var date = new Date();
        var dayLong = 3600 * 1000 * 24 ;
        var iNow = date.getTime();
        var min = iNow + dayLong * parseInt(self.props.beginDays);
        var json = {};
        json[self.props.name] = min;
        self.props.setForms(json);
        self.setState({
            value:min
        });
    }

    render(){
        return (
            <li className="btm-bl right-arrow">
                <label className="form-key">{this.props.displayName ? this.props.displayName : "出生日期"}</label>
                <div className="form-inputbox">
                    <span className={this.state.value ? "datepickerbar numdate" : "datepickerbar placedate" } onClick={(e) => {this.chooseDate(e)}}>{ this.state.value ? methods.date(this.state.value) : "请选择" }</span>
                </div>
            </li>
        )
    }
}
