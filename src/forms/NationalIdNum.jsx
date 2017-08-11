import React from 'react';
import methods from '../assets/methods';

const commonTips = '身份证号有误，请核实后重新输入。';
const rangTips = '身份证号中年龄不符合投保要求。';
const minTips = '身份证号中年龄小于投保要求年龄。';
const maxTips = '身份证号中年龄大于投保要求年龄。';
const numberTips = '身份证号位数有误，请核实后重新输入。';

export default class NationalIdNum extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        /*
        * let idJson = {
        *    type: "insuredPerson",
             min: 18,
             max: 45,
             value: this.state.nationalIdNum
        * }
        * <NationalIdNum {...idJson} setForms={(data) => this.commFrom(data)} formTips={(msg) => this.formTips(msg)}/>
        * */
    }

    translateDate(str){
        var year = str.substring(0,4);
        var month = str.substring(4,6) - 1;
        var date = str.substring(6,8);
        return new Date(year,month,date).getTime();
    }

    listenNationalIdNum(val,type){
        let vals = val.trim();
        let self = this;
        let dates = new Date();
        let iNow = dates.getTime();
        let year = dates.getFullYear();
        let month = dates.getMonth();
        let date = dates.getDate();
        let daylong = 3600 * 1000 * 24;
        //
        if(vals && vals.length == 18){
            if(methods.regex.idCard.test(vals)){ //符合正则
                var birthday = self.translateDate(vals.substring(6,14));
                var minDay = parseInt(self.props.minDays || 0); //最小年龄
                var minAge = parseInt(self.props.minAge || 0); //最小年龄
                var maxAge = parseInt(self.props.maxAge || 80); //如果没有限制大致写个年龄这个到时候具体处理
                //找出区域
                var ageStart = year - (maxAge + 1);
                var ageEnd = year - minAge;
                //算出对应的时间戳
                var startStamp = new Date(ageStart,month,date).getTime();
                var endStamp = new Date(ageEnd,month,date).getTime() - minDay * daylong;
                //区域判断
                if(startStamp < birthday && birthday <= endStamp){
                    var json = {};
                    json[self.props.name] = vals;
                    this.props.setForms(json);
                }else{ //不在给定的区域范围内
                    if(startStamp > birthday){ //年龄填写大了
                        self.formTips(self.props.name == "policyHolderNationalId" ? "投保人" + maxTips : "被保人" + maxTips);
                    }else{
                        self.formTips(self.props.name == "policyHolderNationalId" ? "投保人" + minTips : "被保人" + minTips);
                    }
                    //self.formTips(rangTips);
                    self.resetOptions();
                }
            }else{
                self.formTips(commonTips);
                self.resetOptions();
            }
        }else if(vals && vals.length > 18){
            self.formTips(numberTips);
            self.resetOptions();
        }else if(vals && type == 'blur' && vals.length != 15){ //blur调用
            self.resetOptions();
            self.formTips(numberTips);
        }else if(vals.length == 0 && type == 'blur'){
            self.resetOptions();
        }
    }
    //不符合将重置数据为空
    resetOptions(){
        if(this.props.name == "policyHolderNationalId"){ //投保人
            this.props.setForms({
                "policyHolderNationalId":''
            });
        }else{ //被保人
            this.props.setForms({
                "insuredNationalId":''
            });
        }
    }

    formTips(msg){
        this.props.formTips(msg);
    }

    componentDidMount() {
        //var year = new Date().getFullYear() - parseInt(this.props.defaultAge);
        //this.props.setForms({
        //    "birthday":new Date(year+"/01/01").getTime()
        //});
    }

    render(){
        return (
            <li className="btm-bl">
                <label className="form-key">身份证号</label>
                <div className="form-inputbox">
                    <input type="text" className="upcase" placeholder={this.props.placeholder || "请输入"} defaultValue={this.props.defaultChooseValue} onChange={(e) => {this.listenNationalIdNum(e.target.value)}} onBlur={(e) => {this.listenNationalIdNum(e.target.value,'blur')}} />
                </div>
            </li>
        )
    }
}
