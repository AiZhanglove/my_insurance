import React from 'react';
import methods from '../assets/methods';
require('../components/DatePicker.css');
export default class DatepickerComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            value:props.value ? props.value : 0
        }
    }

    getInit(init){
        var date = new Date();
        var year = date.getFullYear();
        var initYear = year - parseFloat(init);
        return new Date(initYear + "/01/01").getTime();
    }

    getTargetDate(year,month,day){
        var date = new Date();
        date.setFullYear( date.getFullYear() + year );
        date.setMonth( date.getMonth() + month );
        date.setDate( date.getDate() + day );
        return date.getTime();
    }

    chooseDate(e){
        var self=this;
        var date = new Date();
        var year = date.getFullYear();
        var defaultYear = self.props.defaultValue > 0 ? self.props.defaultValue : Math.round((self.props.minValue + self.props.maxValue) / 2);
        var backDate = self.getTargetDate(defaultYear * -1,0,0);
        var maxYear = parseInt(self.props.maxValue);
        var minYear = parseInt(self.props.minValue);
        if(maxYear !== minYear){ //说明是年龄区间
            maxYear = maxYear + 1
        }
        var maxChooseDate = self.getTargetDate(minYear * -1,0,parseInt(self.props.minDays + 1) * -1 );
        methods.datePicker({
            minDate:methods.getPointStamp(maxYear),
            maxDate:maxChooseDate,
            initDate:self.props.value > 0 ? self.props.value : backDate,
            callback:function(timestamp){
                self.setState({
                    value:timestamp
                })
                var json = {};
                json[self.props.name] = timestamp;
                self.props.setForms(json,self.props.index);
            }
        })
    }

    setDefaultValue(){
        var self = this;
        if(self.props.value){
            self.setState({
                value:self.props.value
            })
        }else {
            if(self.props.defaultValue > 0){
                self.setState({
                    value:self.getInit(self.props.defaultValue)
                }, function () {
                    var json = {};
                    json[self.props.name] = self.getInit(self.props.defaultValue);
                    self.props.setForms(json,self.props.index);
                })
            }else{
                //self.setState({
                //    value:self.getInit(self.props.minValue)
                //}, function () {
                //    var json = {};
                //    json[self.props.name] = self.getInit(self.props.minValue);
                //    self.props.setForms(json,self.props.index);
                //})
            }
        }
    }

    //setDefaultValue(){
    //    var self = this;
    //    if(self.props.value){
    //        self.setState({
    //            value:self.props.value
    //        })
    //    }else if(self.props.defaultValue){
    //        self.setState({
    //            value:self.getInit(self.props.defaultValue)
    //        }, function () {
    //            var json = {};
    //            json[self.props.name] = self.getInit(self.props.defaultValue);
    //            self.props.setForms(json,self.props.index);
    //        })
    //    }
    //}

    componentDidMount() {
        var self = this;
        self.setDefaultValue();
    }

    render(){
        var self = this;
        return (
            <ul className="ins-form_newcommon">
                <li className="right-arrow btm-bl">
                    <label className="form-key">{self.props.displayName}</label>
                    <div className="form-inputbox">
                        <span className={self.state.value > 0 ? "datepickerbar numdate" : "datepickerbar placedate" } onClick={(e) => {self.chooseDate(e)}}>{ self.state.value == 0 ? self.props.placeholder ? self.props.placeholder : "请选择" : methods.date(self.state.value)}</span>
                    </div>
                </li>
            </ul>
        )
    }
}