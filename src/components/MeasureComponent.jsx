import React from 'react';
import methods from '../assets/methods.js';
import config from  '../assets/config.js';
import Button1 from '../components/Button1.jsx';
import Notifications, {notify} from '../components/Toast.jsx';
import DatepickerComponent from '../frame/DatepickerComponent.jsx';
import CascadeAddress from '../forms/CascadeAddress.jsx'; //级联地址选择
import SocialSecurityComponent from '../forms/SocialSecurityComponent.jsx';
require("./Measure.less");
export default class MeasureComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showModal:false,
            btnDisabled:false,
            showPostion:false, //地址级联的弹出层
            configs:'',
            params: localStorage["testPush" + props.id] ? JSON.parse(localStorage["testPush" + props.id]) : {
                sumInsured:'',
                policyPeriod:'',
                payPeriodPremiums:''
            },
            insureds:'',
            premiums:'', //保费单元
            payTypes:'',
            premium:0,
            desc:'',
            //展示用
            baoe:'', //保额
            baotime:''//保障时间
        };
    }
    //公共的显示隐藏的方法
    commonToggleModal(type,data){
        var self = this;
        switch (type.toLowerCase()){
            case "postion":
                self.setState({
                    showPostion:data
                });
                break;
            case "postion_hide":
                self.setState({
                    showPostion:false
                });
                break;
        }
    }
    //显示隐藏弹出
    cancel(){
        this.setState({
            showModal:false
        })
    }
    //
    extend(res,target){
        for (let k in target) {
            res[k] = target[k];
        }
        return res;
    }
    //根据返回数据找到需要提交的数据字段
    setRequireParams(arr){
        var self = this;
        var hook = {};
        arr.map(function (el, index) {
            if(el.requiredType == "REQUIRED"){
                if(el.rangeItems &&  el.rangeItems.length > 0){
                    hook[el.name] = self.getDefaultValue(el.rangeItems,"defaultOption").name;
                }else{
                    if(el.type == "BIRTHDAY"){
                        hook[el.name] = '';
                    }else{
                        hook[el.name] = el.value ? el.value : ''
                    }
                }
            }
        });
        self.setState({
            params:self.extend(self.state.params,hook)
        }, function () { //默认参数设置并且调用保额接口
            self.getSumInsured(self.state.params);
        });
    }
    //获取默认的数据字段
    getDefaultValue(arr,tag){
        var hook = {};
        tag = tag || "defaultValue";
        arr.map(function (el, index) {
            if(el[tag]){
                hook = el;
            }
        });
        return hook;
    }
    //
    getTargetDefault(arr,tag,obj){
        var hook = {};
        tag = tag || "defaultValue";
        arr.map(function (el, index) {
            if(el[obj][tag]){
                hook = el;
            }
        });
        return hook;
    }

    //获取配置数据接口
    getConfigs(){
        var self = this;
        methods.Ajax({
            type:'GET',
            url:'/v1/insurance/product/productParams',
            //url:'/v1/insurance/product/productInsured',
            params:{
                productId:self.props.id,
                usage:"PLAN_SELECT"
            },
            success:function(res){
                if(res.success){
                    var params =  JSON.parse(res.params);
                    self.setRequireParams(params);
                    self.setState({
                        configs:params
                    })

                }
            }
        })
    }

    //获取保额保费接口
    getSumInsured(data){
        var self = this;
        self.setState({
            btnDisabled:true
        });
        methods.Ajax({
            type:'GET',
            url:'/v1/insurance/product/sumInsuredPeriodPremiums',
            params:{
                productId:self.props.id,
                data:JSON.stringify(data)
            },
            success:function(res){
                if(res.success){
                    var defaultPremium = self.getTargetDefault(res.sumInsuredPeriodPremiums,"defaultOption","sumInsured");
                    //默认保障时间选择项
                    var activeTimeRange = self.getTargetDefault(defaultPremium.periodPremiums,"defaultOption","policyPeriod");
                    if(defaultPremium.sumInsured.name == ""){
                        defaultPremium = self.getTargetDefault(res.sumInsuredPeriodPremiums,"defaultOption","sumInsured");
                    }
                    //描述
                    var oriPayTypes = activeTimeRange.payPeriodPremiums;
                    var defaultDesc = self.getDefaultValue(oriPayTypes,"defaultOption");
                    //重置的时候需要找到所有默认值(巨坑,应该是联动)
                    var paramsJson = {
                        sumInsured:defaultPremium.sumInsured.name,
                        policyPeriod:activeTimeRange.policyPeriod.name,
                        payPeriodPremiums:self.getDefaultValue(activeTimeRange.payPeriodPremiums,"defaultOption").name
                    };
                    var json = {
                        insureds:res.sumInsuredPeriodPremiums,
                        premiums:defaultPremium,
                        payTypes:oriPayTypes,
                        desc:defaultDesc.desc,
                        premium:self.getDefaultValue(activeTimeRange.payPeriodPremiums,"defaultOption").premium,
                        baoe:defaultPremium.sumInsured.displayName,
                        baotime:activeTimeRange.policyPeriod.displayName,
                        params:self.extend(self.state.params,paramsJson),
                        btnDisabled:false //辅助展示按钮状态
                    }
                    self.setState(json,function(){
                        self.emit({
                            hasChoosed:self.state.baotime + " " + self.state.baoe ,//保障时间,保额
                            premium:self.state.premium
                        });
                        //存储下需要会给后台的数据
                        if(window.localStorage){
                            localStorage["testPush" + self.props.id] = JSON.stringify(self.state.params);
                        }
                    });
                }
            },
            error:function(){
                self.setState({
                    btnDisabled:false
                })
            }
        })
    }
    //关闭保费测试弹出层
    hideModal(){
        this.props.closeModal();
    }
    //阻止滚动
    stopScroll(e){
        e.preventDefault();
        e.stopPropagation();
    }
    //待定
    commFrom(data){
        var self = this;
        self.setState({
            params:self.extend(self.state.params,data)
        }, function () { //默认参数设置并且调用保额接口
            self.getSumInsured(self.state.params);
        });
    }

    //重置数据结构
    resetOptions(arr,ind,tag){
        var hook = '';
        tag = tag || "defaultValue";
        arr.map(function (el, index) {
            if(ind == index){
                el[tag] = true;
                hook = el.name;
            }else{
                el[tag] = false;
            }
        });
        return {
            arr:arr,
            val:hook
        };
    }
    //
    resetObjOptions(arr,ind,tag,obj){
        var hook = '';
        tag = tag || "defaultValue";
        arr.map(function (el, index) {
            if(ind == index){
                el[obj][tag] = true;
                hook = el[obj].name;
            }else{
                el[obj][tag] = null;
            }
        });
        return {
            arr:arr,
            val:hook
        };
    }

    //选择生日
    chooseBirthday(data,index){
        var self = this;
        var oldConfigs = self.state.configs;
        for (var i in data) {
            oldConfigs[index].value = data[i];
        }

        self.setState({
            configs:oldConfigs,
            params:self.extend(self.state.params,data)
        }, function () { //默认参数设置并且调用保额接口
            self.getSumInsured(self.state.params);
        });
    }
    //选择生日
    commonReceiveParams(data,index){
        var self = this;
        var oldConfigs = self.state.configs;
        for (var i in data) {
            oldConfigs[index].value = data[i];
        }

        self.setState({
            configs:oldConfigs,
            params:self.extend(self.state.params,data)
        }, function () { //默认参数设置并且调用保额接口
            self.getSumInsured(self.state.params);
        });
    }
    //
    commonSetParams(data,index){
        var self = this;
        var oldConfigs = self.state.configs;
        var json = {}
        oldConfigs[index].value = data.txt;
        json[oldConfigs[index].name] = data[oldConfigs[index].name];
        self.setState({
            configs:oldConfigs,
            params:self.extend(self.state.params,json)
        }, function () { //默认参数设置并且调用保额接口
            self.getSumInsured(self.state.params);
        });
    }
    //选择选项
    chooseOptions(el,index,pos){
        var self = this;
        var oldConfigs = self.state.configs;
        var oldParams = self.state.params;
        var newConfigs = self.resetOptions(oldConfigs[index].rangeItems,pos,"defaultOption");
        oldConfigs[index].rangeItems = newConfigs.arr;
        oldParams[oldConfigs[index].name] = newConfigs.val;
        self.setState({
            configs:oldConfigs,
            params:oldParams
        }, function () {//回调的时候调用获取保费
            self.getSumInsured(oldParams);
        })
    }
    //选择保额
    chooseInsured(el, index){
        var self = this;
        var oldArr = self.state.insureds;
        var newList = self.resetObjOptions(oldArr,index,"defaultOption","sumInsured");
        var activeInsuredTime = self.getTargetDefault(el.periodPremiums,"defaultOption","policyPeriod");
        //描述
        var oriPayTypes = activeInsuredTime.payPeriodPremiums;
        var defaultDesc = self.getDefaultValue(oriPayTypes,"defaultOption");
        //设置参数
        var paramsJson = {
            sumInsured:el.sumInsured.name,
            policyPeriod:activeInsuredTime.policyPeriod.name,
            payPeriodPremiums:self.getDefaultValue(activeInsuredTime.payPeriodPremiums,"defaultOption").name
        };
        //
        self.setState({
            insureds:newList.arr,
            premiums:el,
            payTypes:oriPayTypes,
            desc:defaultDesc.desc,
            premium:self.getDefaultValue(activeInsuredTime.payPeriodPremiums,"defaultOption").premium,
            baoe:el.sumInsured.displayName,
            baotime:activeInsuredTime.policyPeriod.displayName,
            params:self.extend(self.state.params,paramsJson)
        });
    }
    //选择保障时间
    choosePremiums(el,index){
        var self = this;
        var oldPremiums = self.state.premiums;
        oldPremiums.periodPremiums = self.resetObjOptions(oldPremiums.periodPremiums,index,"defaultOption","policyPeriod").arr;
        var oldParams = self.state.params;
        oldParams.policyPeriod = el.policyPeriod.name;
        oldParams.payPeriodPremiums = self.getDefaultValue(el.payPeriodPremiums,"defaultOption").name
        //描述
        var oriPayTypes = oldPremiums.periodPremiums[index].payPeriodPremiums;
        var defaultDesc = self.getDefaultValue(oriPayTypes,"defaultOption");
        //
        self.setState({
            premiums:oldPremiums,
            payTypes:oriPayTypes,
            desc:defaultDesc.desc,
            premium:self.getDefaultValue(oldPremiums.periodPremiums[index].payPeriodPremiums,"defaultOption").premium,
            baotime:el.policyPeriod.displayName,
            params:oldParams
        });
    }
    //选择缴费方式
    choosePayType(el,index){
        var self = this;
        var oldPayTypes = self.state.payTypes;
        oldPayTypes = self.resetOptions(oldPayTypes,index,"defaultOption").arr;
        var oldParams = self.state.params;
        oldParams.payPeriodPremiums = el.name;
        //
        self.setState({
            premium:el.premium,
            payTypes:oldPayTypes,
            params:oldParams,
            desc:el.desc
        });
    }

    checkParams(){
        var self = this;
        var params = self.state.params;
        var hook = true;
        var tipsName = '';
        var testData = self.state.configs;
        for (var i = 0; i < testData.length; i++) {
            if(!params[testData[i].name]){
                hook = false;
                tipsName = testData[i].displayName;
                break;
            }
        }
        return {
            valid:hook,
            tipsName:tipsName
        };
    }
    //去购买
    gotoBuy(){
        var self = this;
        //按照产品的id存储
        localStorage["testData" + self.props.id] = JSON.stringify({
            configs:self.state.configs,
            insureds:self.state.insureds,
            premiums:self.state.premiums,
            premium:self.state.premium,
            payTypes:self.state.payTypes,
            desc:self.state.desc,
            baoe:self.state.baoe,
            baotime:self.state.baotime
        });
        //
        localStorage["testPush" + self.props.id] = JSON.stringify(self.state.params);
        var result = self.checkParams();
        if(result.valid){
            self.emit({
                hasChoosed:self.state.baotime + " " + self.state.baoe, //保障时间,保额
                premium:self.state.premium,
                showSelectPage:false,
                canJump:true
            })
            self.hideModal();
            //更新缓存开始时间
            localStorage["ins_expire_" + self.props.id] = new Date().getTime();
        }else{
            notify.show("请正确填写"+result.tipsName+"字段");
        }
    }
    //数据会传到上个页面
    emit(data){
        var self = this;
        self.props.fn(data)
    }

    setOuter(bol){
        if(bol){
            document.documentElement.style.height = "100vh";
            document.body.style.height = "100vh";
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";

        }else{
            document.documentElement.style.height = "auto";
            document.body.style.height = "auto";
            document.documentElement.style.overflow = "auto";
            document.body.style.overflow = "auto";
        }
    }

    componentDidMount() {
        var self = this;
        //这里可以判断是否有数据然后判断是否要从新拉取数据
        var oldData = localStorage["testData" + self.props.id];
        var oldParams = localStorage["testPush" + self.props.id];
        //获取现在的时间和以前存储的时间戳比较来处理过期
        var bufferTime = 3600 * 1000 * 2; //过期时间
        var currentTime = new Date().getTime(); //当前时间戳
        var oldTime = localStorage["ins_expire_" + self.props.id] || bufferTime; //存储时间戳
        var lastTime = currentTime - parseInt(oldTime); //缓存持续时间
        //
        if(window.localStorage && oldData && lastTime < bufferTime){
            oldData = JSON.parse(oldData);
            self.setState({
                configs:oldData.configs,
                insureds:oldData.insureds,
                premiums:oldData.premiums,
                premium:oldData.premium,
                payTypes:oldData.payTypes,
                desc:oldData.desc,
                baoe:oldData.baoe,
                baotime:oldData.baotime
            }, function () {
                self.emit({
                    hasChoosed:self.state.baotime + " " + self.state.baoe ,//保障时间,保额
                    premium:self.state.premium
                })
            });
            //判断参数是不是为空为空在去取值
            if(window.localStorage && oldParams){
                oldParams = JSON.parse(oldParams);
                var hook = true;
                for(var i in oldParams){
                    if(oldParams[i] === ""){
                        hook = false;
                    }
                }
                if(!hook){
                    self.getConfigs();
                }
            }
        }else{
            self.getConfigs();
        }
    }

    render() {
        var self = this;
        self.setOuter(self.props.show);
        var btnclass = self.state.btnDisabled ? 'measure-btn measure-btn-disabled' : 'measure-btn';
        return (
            <div className={self.props.show ? "measure-container showModal" : "measure-container"}>
                <div className="measure-mask" onClick={() => self.hideModal()}></div>
                <div className="measure-inner" >
                    <div className="measure-head btm-bl">
                        保费: <span className="ins-orange">{methods.fen2Yuan(self.state.premium,2)}元</span>
                        <span className="close-measure" onClick={() => self.hideModal()}></span>
                    </div>
                    <div className="measure-content">
                        {
                            self.state.configs && self.state.configs.map(function (el, index) {
                                var tag = '';
                                switch (el.type){
                                    case "AGE_RANGE":
                                    case "GENDER":
                                        tag = <dl className="measure-list" key={index} >
                                            <dt>{el.displayName}</dt>
                                            <dd className="flex-container-box">
                                                {
                                                    el.rangeItems.map(function (ele,ind) {
                                                        return (<div onClick={() => self.chooseOptions(ele,index,ind)} className={ ele.defaultOption ?  "flex-single loan-border active" : "flex-single loan-border"} key={ind}>{ele.displayName}</div>)
                                                    })
                                                }
                                            </dd>
                                        </dl>;
                                        break;
                                    case "BIRTHDAY":
                                        tag = <DatepickerComponent {...el} key={index} index={index} parameter={el.parameter} setForms={(data,pos) => self.chooseBirthday(data,pos)} />
                                        break;
                                    case "CITY":
                                        tag = <ul key={index} className="ins-form_newcommon">
                                            <li className="btm-bl right-arrow">
                                                <label className="form-key">{el.displayName}</label>
                                                <div className="form-inputbox" onClick={() => self.commonToggleModal("postion",{"index":index,"name":el.name})}>
                                                    <span className={el.value ? "datepickerbar numdate" : "datepickerbar placedate" }>{ el.value ? el.value : el.placeholder || "请选择" }</span>
                                                    {/*<input className="limit-words" placeholder={el.placeholder || "请选择"} value={el.value} disabled type="text"/>*/}
                                                </div>
                                            </li>
                                        </ul>;
                                        break;
                                    case "SOCIAL_SECURITY":
                                        tag = <SocialSecurityComponent key={index} {...el} index={index} setForms={(data,pos) => self.commonReceiveParams(data,pos)}  />;
                                        break;
                                    default:
                                        tag = "还没有添加的数据结构";
                                        break;
                                }
                                return (
                                    tag
                                )
                            })
                        }

                        {
                            self.state.insureds && <dl className="measure-list">
                                <dt>保额</dt>
                                <dd className="flex-container-box">
                                    {
                                        self.state.insureds &&  self.state.insureds.map(function (ele, index) {
                                            return (<div onClick={() => self.chooseInsured(ele,index)} className={ ele.sumInsured.defaultOption ?  "flex-single loan-border active" : "flex-single loan-border"} key={index}>{ele.sumInsured.displayName}</div>)
                                        })
                                    }
                                </dd>
                            </dl>
                        }

                        {
                            self.state.premiums &&
                            <dl className="measure-list">
                                <dt>保障时间</dt>
                                <dd className="flex-container-box">
                                    {
                                        self.state.premiums &&  self.state.premiums.periodPremiums.map(function (ele, index) {
                                            return (<div onClick={() => self.choosePremiums(ele,index)} className={ ele.policyPeriod.defaultOption ?  "flex-single loan-border active" : "flex-single loan-border"} key={index}>{ele.policyPeriod.displayName}</div>)
                                        })
                                    }
                                </dd>
                            </dl>
                        }

                        {
                            self.state.payTypes &&
                            <dl className="measure-list">
                                <dt>缴费方式</dt>
                                <dd className="flex-container-box">
                                    {
                                        self.state.payTypes &&  self.state.payTypes.map(function (ele, index) {
                                            return (<div onClick={() => self.choosePayType(ele,index)} className={ ele.defaultOption ?  "flex-single loan-border active" : "flex-single loan-border"} key={index}>{ele.displayName}</div>)
                                        })
                                    }
                                </dd>
                            </dl>
                        }

                        {
                            self.state.desc &&
                            <dl className="measure-list">
                                <dt>缴费说明</dt>
                                <dd className="flex-container-box">
                                    <div className="measure-list-desc">{self.state.desc}</div>
                                </dd>
                            </dl>
                        }

                    </div>
                    <div className="measure-btnbox top-bl">
                        <span className={btnclass} onClick={() => self.gotoBuy()}>{self.props.title ? self.props.title : "确定"}</span>
                    </div>
                </div>
                <Notifications/>
                <CascadeAddress id={self.props.id} show={self.state.showPostion} setForms={(data,pos) => self.commonSetParams(data,pos)} hidePop={() => self.commonToggleModal("postion_hide")} />
            </div>
        );
    }
}