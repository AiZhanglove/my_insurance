import React from 'react';
import methods from '../assets/methods';
export default class DatepickerComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        /*usage:
        * min:"16" 最小值
        * max:"36" 最大值
        * init:"26" 默认显示年龄
        * value:{this.state.birthday} 初始化显示的数据
        * 使用方式:
        * <DatepickerComponent min="16" max="36" init="26" value={this.state.birthday} setForms={(data) => this.commFrom(data)}/>
        * or let datepickerJson = {
        *    min:"16",
             max:"36" ,
             init:"26" ,
             value:{this.state.birthday}
        * }
        * <DatepickerComponent {...datepickerJson} setForms={(data) => this.commFrom(data)}/>
        * */
    }

    chooseDate(e){
        var self=this;
        var date = new Date();
        var year = date.getFullYear();
        var initYear = year - parseFloat(self.props.init);
        var maxChooseDate = date.getTime() - parseFloat(self.props.min);
        var backDate = new Date(initYear + "/01/01").getTime();
        var maxYear = parseFloat(self.props.max);
        methods.datePicker({
            minDate:methods.getPointStamp(maxYear),
            maxDate:maxChooseDate,
            initDate:self.props.value > 0 ? self.props.value : backDate,
            callback:function(timestamp){
                self.props.setForms({
                    birthday:timestamp
                });
            }
        })
    }

    render(){
        return (
            <li className="border right-arrow">
                <label className="form-key">{this.props.labelName ? this.props.labelName : "出生日期"}</label>
                <div className="form-inputbox">
                    <span className={this.props.value > 0 ? "datepickerbar numdate" : "datepickerbar placedate" } onClick={(e) => {this.chooseDate(e)}}>{ this.props.value == 0 ? "请与子女身份证日期一致" : methods.date(this.props.value)}</span>
                </div>
            </li>
        )
    }
}
