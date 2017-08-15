import React from 'react';
import config from '../assets/config.js';
import methods from '../assets/methods.js';
import NewButton from '../forms/NewButton.jsx';
import Loading from '../components/Loading.jsx';
import Notifications, {notify} from '../components/Toast.jsx';
import Tickets from '../frame/NewTickets.jsx';
import Measure from '../components/MeasureComponent.jsx';
import Address from '../components/MyAddress.jsx';
import UserName from '../forms/UserName.jsx';
import NationalIdNum from '../forms/NationalIdNum.jsx';
import AddressComponent from '../forms/AddressComponent.jsx';
import DateRangeComponent from '../forms/DateRangeComponent.jsx';
import DateShowComponent from '../forms/DateShowComponent.jsx';
import MobileComponent from '../forms/MobileComponent.jsx';
import DatepickerComponent from './DatepickerComponent.jsx';
import BankListComponent from '../forms/BankListComponent.jsx';
import BankCardComponent from '../forms/BankCardComponent.jsx';
import CommonCascade from '../forms/CommonCascade.jsx'; //公共的级联选择
import CommonCascadeInput from '../forms/CommonCascadeInput.jsx';
import ImeiComponent from '../forms/ImeiComponent.jsx';
//import OccupationInput from '../forms/OccupationInput.jsx'; //职业的展示框
//未来
import EmailComponent from '../forms/EmailComponent.jsx';
//通用的输入组件
import CommonInputComponent from '../forms/CommonInputComponent.jsx';
//imeiex
import ImeiExComponent from '../forms/ImeiExComponent.jsx';

//引入css
require("../frame/frame.less");
export default class FrameBuy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            premium: window.localStorage && localStorage["testData" + props.params.id] ? JSON.parse(localStorage["testData" + props.params.id]).premium : 0,
            instructionId: '',
            forms:'',
            checked: false,
            disabled: false,
            showit: "false",
            myaddress: "",
            addressJson: {},
            couponLimit: 2000,
            couponAmount:0,
            couponId: '',
            isLoading:false,
            showModal:false,
            showJob:false, //职业弹出层
            showCascadeModal:false, //公共的级联弹出控制
            //默认值
            defaultRelation:"SELF",
            //所有默认的选项
            defaultParams:{},
            userInfo:{},
            showCheck:''
        };
    }

    componentWillMount() {
        document.title = "填写保单";
        document.body.className = "grayframe";
    }
    //默认赋值投保人信息
    setDefaultPolice(list){
        var self = this;
        var target = self.state.userInfo;
        list.map(function (el, index) {
            if(target[el.name]){
                el.defaultChooseValue = target[el.name];
            }
        });
        return list;
    }
    //转换成需要的数据结构
    relaTurn(json){
        var relatJson = {
            "name":"policyHolderName",
            "mobilePhone":"policyHolderPhone",
            "nationalIdNum":"policyHolderNationalId"
        };
        var hook = {}
        for(var i in json){
            hook[relatJson[i]] = json[i];
        }
        return hook;
    }
    //获取投保人的信息,包括姓名身份证和手机号
    getUserInfo(cb){
        var self = this;
        var userInfo = localStorage["userThree"+self.props.params.id];
        if(userInfo){
            userInfo = JSON.parse(userInfo);
            self.commFrom(userInfo);
            self.setState({
                userInfo:userInfo
            }, function () {
                cb && cb();
            })
            return false;
        }
        methods.Ajax({
            type: 'GET',
            url: config.api + 'identityInfo',
            success: function (data) {
                if (data.success) {
                    var targetJson = self.relaTurn(data.identityInfo);
                    self.commFrom(targetJson);
                    self.setState({
                        userInfo:targetJson
                    }, function () {
                        cb && cb();
                    })
                }else{
                    cb && cb();
                }
            },
            error:function(status){
                cb && cb();
                console.log(status);
            }
        })
    }
    //获取配置参数
    getConfig(cb){
        var self = this;
        self.setState({
            isLoading:true
        });
        methods.Ajax({
            type: 'GET',
            url: config.api + 'product/productParams',
            params:{
              productId:self.props.params.id,
              usage:"CHECK_INSURANCE"
            },
            success: function (res) {
                var realData = JSON.parse(res.params);
                var defaultRelatonJson = self.getDefaultRelation(realData);
                self.setState({
                    forms:self.setDefaultPolice(realData),
                    defaultRelation:defaultRelatonJson ? defaultRelatonJson.defaultValue : "SELF",
                    isLoading:false
                });
                cb && cb(realData);
            },
            error: function (status) {
                console.log(status);
            }
        });
    }
    //获取我要阅读的接口
    getShowReadTerms(){
        var self = this;
        methods.Ajax({
            type: 'GET',
            url: config.api + 'product/readTerms',
            params:{
                productId:self.props.params.id
            },
            success: function (res) {
                if(res.success){
                    self.setState({
                        showCheck:res
                    })
                }
            },
            error: function (status) {
                console.log(status);
            }
        });
    }
    //获取默认的保障对象
    getDefaultRelation(arr){
        var self = this;
        var hook = '';
        arr.map(function (el, index) {
           if(el.type == "RELATION"){
               hook = el;
           }
        });
        if(hook){
            self.commFrom({
                "relation":hook.defaultValue
            })
        }
        return hook;
    }
    //得到券的回调
    getCoupon(json) {
        this.setState({
                couponId: json.id,
            couponAmount:json.couponAmount,
            couponLimit: json.limit
        })
    }
    //支付按钮点击
    pay() {
        var self = this;
        var checkRes = self.checkParams();
        if(!checkRes.valid){
            notify.show("请正确填写"+checkRes.tipsName+"字段");
            return false;
        }
        /*存储填写的地址
        *  "name":"policyHolderName",
         "mobilePhone":"policyHolderPhone",
         "nationalIdNum":"policyHolderNationalId"
        * */
        localStorage["userThree"+self.props.params.id] = JSON.stringify({
            "policyHolderName":self.state.defaultParams.policyHolderName,
            "policyHolderPhone":self.state.defaultParams.policyHolderPhone,
            "policyHolderNationalId":self.state.defaultParams.policyHolderNationalId
        });
        //
        var mysource = methods.getParam("source");
        var myfrom = methods.getParam("from") || "local"; //区分来自为以后不同渠道分润做准备
        var couponFrom = methods.getParam("couponFrom") || "couponDefaultLocal"; //红包返现使用
        var myurl = location.protocol+'//'+location.host+'/insurance/insurance.html?source='+mysource+'#/result';
        if (!this.state.disabled) {
            this.setState({
                disabled: true,
                isLoading:true
            });
            //处理data参数
            methods.Ajax({
                type: 'POST',
                url: config.api + 'checkInsurance?from=' + myfrom + "&couponFrom=" + couponFrom,
                data: {
                    id: self.state.instructionId,
                    productId: self.props.params.id,
                    ticketId: self.state.couponId,
                    data: JSON.stringify(self.state.defaultParams), //填单页的数据
                    planSelectData:localStorage["testPush" + self.props.params.id]
                },
                success: function (data) {
                    var j;
                    var params=[];
                    var one;
                    var url ='https://api.ucashier.mipay.com/api/trade/doWapCreate?';
                    self.setState({
                        disabled:false,
                        isLoading:false
                    })
                    if(data.success){
                        //设置刷新的tag
                        methods.setReload(true,'common_buy');
                        if(data.order.obtainMode == "PRESENT" || data.paySignedJson == "mock signed json"){
                            methods.startActivity(myurl,'支付结果');
                        }else{
                            if(data.payCenterUrl){
                                methods.startActivity(data.payCenterUrl,'支付中心')
                                return false;
                            }
                            j=JSON.parse(data.paySignedJson);
                            for(one in j){
                                params.push(one+'='+j[one])
                            }
                            if(location.host=='staging.mifi.pt.xiaomi.com'){
                                url='http://staging.api.ucashier.mipay.com/api/trade/doWapCreate?'
                            }
                            methods.startActivity(encodeURI(url+params.join('&')),'小米钱包')
                        }
                    }else{
                        notify.show(data.error);
                        //重新生成id
                        self.getId();
                    }
                },
                error: function (status) {
                    //重新生成id
                    self.getId();
                    notify.show(status)
                    self.setState({
                        disabled:false,
                        isLoading:false
                    })
                }
            })
        }
        //统计
        MiFiLoantracker({
            pageTitle: 'ins_pay_' + self.props.params.id,
            productType: "insurance"
        });
    }
    //获取唯一id用来表示本次的购买
    getId(){
        var self = this;
        methods.Ajax({
            type: 'GET',
            url: config.api + 'id',
            success: function (data) {
                if (data.success) {
                    self.setState({
                        instructionId: data.value
                    })
                    localStorage.instructionId = data.value
                }
            }
        })
    }
    //布局主要是为了适应底部的按钮
    layout(){
        this.refs.layout.style.paddingBottom= "62px";
    }
    //react的did的声明周期
    componentDidMount() {
        var self = this;
        //初始化调用方法
        self.getShowReadTerms();
        self.layout();
        self.getId();
        //初始化拉取表单配置
        self.getUserInfo(function () {
            self.getConfig();
        });
        //写cookie完成回调
        window.onLoginServiceResultCallback = function () {
            self.getId();
            self.getUserInfo(function () {
                self.getConfig();
            });
            window.componetCallback();
        }
        //监听登陆成功回调
        window.onLoginResultCallback = function(){
            window.location.reload();
        }
        //登陆失败回调
        window.onLoginResultFailCallback = function(){
            window.location.reload();
        }
        //给页面设置tag,为后面的刷新tag做准备
        methods.setPageTag('common_buy');
        //支付回来轻度刷新页面
        window.onReload = function () {
            self.getId();
            //self.getUserInfo(function () {
            //    self.getConfig();
            //});
        }
        //统计方法
        MiFiLoantracker({
            pageTitle: 'ins_in_'+self.props.params.id,
            miId:methods.getCookie("cUserId") || methods.getCookie("userId") || "",
            productType: "insurance"
        });
    }
    //获取地址的方法
    getAddress(res) {
        var self = this;
        var params = self.state.defaultParams;
        if (res) {
            params[res.type] =  JSON.stringify({
                provinceCode:res.provinceCode,
                cityCode:res.cityCode,
                address:res.address
            });
            self.setState({
                myaddress: res.allAddress,
                addressJson: res,
                showit: "false",
                defaultParams:params
            })
        } else {
            self.setState({
                showit: "false"
            })
        }
    }
    //显示添加地址的弹出层
    showAddModal(data) {
        var self = this;
        self.setState(data)
    }
    commonShowModal(type,data){
        var self = this;
        switch (type){
            case "JOB": //职业弹出层
                self.setState({
                    showJob:data
                });
                break;
            case "JOB_hide":
                self.setState({
                    showJob:false
                });
                break;
            case "Support": //显示保障方案的弹出层
                self.setState({
                    showModal:true
                });
                break;
            case "Support_hide"://隐藏保障方案的弹出层
                self.setState({
                    showModal:false
                });
                break;
            case "commonCascade":
                self.setState({
                    showCascadeModal:data
                });
                break;
            case "commonCascade_hide":
                self.setState({
                    showCascadeModal:false
                });
                break;
        }
    }

    //隐藏保障方案的弹出层
    hideModal(){
        var self = this;
        self.setState({
            showModal:false
        })
    }
    //新的组件的数据回流
    commFrom(data) {
        var self = this;
        var params = self.state.defaultParams;
        for (var i in data) {
            params[i] = data[i];
        }
        self.setState({
            defaultParams:params
        });
    }
    //
    extend(res,target){
        for (let k in target) {
            res[k] = target[k];
        }
        return res;
    }
    //公用的级联数据回流
    commCascadeFrom(data,index){
        var self = this;
        var oldConfigs = self.state.forms;
        var params = self.state.defaultParams;
        oldConfigs[index].value = data.txt;
        params[oldConfigs[index].name] = data[oldConfigs[index].name];
        self.setState({
            forms:oldConfigs,
            defaultParams:params
        });
    }


    //提示数据回流
    formTips(msg) {
        notify.show(msg)
    }
    //获取相关的数据为提交使用
    getRelat(e,index){
        var self = this;
        var oldVal = self.state.defaultRelation;
        var newVal = e.target.value;
        if(oldVal != newVal){
            self.setState({
                "defaultRelation":newVal
            })
        }
        var json = {};
        json[self.state.forms[index].name] = newVal;
        self.commFrom(json);
    }
    //过滤出所需提交的字段分成必须和所有
    getAllRequire(){
        var self = this;
        var res = self.state.forms;
        var allTargets = [];
        var requireTargets = [];
        res.map(function (el, index) {
           if(el.type !== "GAP"){
               allTargets.push(el);
               if(el.requiredType === "REQUIRED"){
                   requireTargets.push(el);
               }
           }
        });
        return {
            all:allTargets, //全部数据
            require:requireTargets //全部数据必填数据
        };
    }
    //用于展示保费测算的选择文字展示
    getChoosed(data){
        var self = this;
        self.setState(data)
    }
    //如果参数填写了返回true,反之返回false
    checkParams(){
        var self = this;
        var params = self.state.defaultParams;
        var hook = true;
        var tipsName = '';
        var res = self.getAllRequire();
        var testData = res.all;
        if(self.state.defaultRelation == "SELF"){ //自己
            testData = res.require;
        }
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
    //react 渲染
    render() {
        var self = this;
        var button;
        if (this.state.checked && !this.state.disabled) {
            button = <NewButton premium={self.state.premium} couponAmount={self.state.couponAmount} onClick={()=>self.pay()} value="立即购买"/>
        } else {
            button = <NewButton premium={self.state.premium} couponAmount={self.state.couponAmount} class="disabled" value="立即购买"/>
        }
        return (
            <div ref="layout" id="layout">
                <ul className="ins-form_newcommon" onClick={() => self.commonShowModal("Support")}>
                    <li className="right-arrow">
                        <label className="form-key">保障方案</label>
                        <div className="form-inputbox"><span className="datepickerbar text-premium-choosed">{self.state.hasChoosed}</span></div>
                    </li>
                </ul>
                {
                    self.state.forms &&  <ul className="ins-form_newcommon">
                        {
                            self.state.forms.map(function (el,index) {
                                var comp = '';
                                switch (el.type){
                                    case "GAP":
                                        comp = <li key={index} className="ins-border btm-bl ins-form_head">{el.displayName}</li>
                                        break;
                                    case "NAME":
                                        el.name == "insuredName" && self.state.defaultRelation == "SELF" ? '' : comp = <UserName key={index} {...el} setForms={(data) => self.commFrom(data)} formTips={(msg) => self.formTips(msg)}/>
                                        break;
                                    case "MOBILE_PHONE":
                                        el.name == "insuredPhone" && self.state.defaultRelation == "SELF" ? '' : comp = <MobileComponent key={index} {...el} formTips={(msg) => self.formTips(msg)} setForms={(data) => self.commFrom(data)}/>
                                        break;
                                    case "BIRTHDAY":
                                        comp = <DatepickerComponent key={index} {...el} setForms={(data) => self.commFrom(data)}/>
                                        break;
                                    case "NATIONAL_ID":
                                        el.name == "insuredNationalId" && self.state.defaultRelation == "SELF" ? '':
                                        comp = <NationalIdNum key={index} {...el} setForms={(data) => self.commFrom(data)} formTips={(msg) => self.formTips(msg)}/>
                                        break;
                                    case "RELATION":
                                        comp = <li key={index} className="btm-bl right-arrow">
                                            <label className="form-key">{el.displayName}</label>
                                            <div className="form-inputbox">
                                                {
                                                    el.rangeItems &&  <select value={self.state.defaultRelation} onChange={(e) => self.getRelat(e,index)}>
                                                    {
                                                        el.rangeItems.map(function (ele,indx) {
                                                            return (
                                                                <option key={indx} value={ele.name}>{ele.displayName}</option>
                                                            )
                                                        })
                                                    }
                                                    </select>
                                                }
                                            </div>
                                        </li>;
                                        break;
                                    case "BANK_CITY":
                                    case "CITY":
                                    case "CITY_NEW":
                                        comp = <CommonCascadeInput key={index} {...el} showOcc={() => self.commonShowModal("commonCascade",{"name":el.name,"index":index,"ajaxType":"CITY"})} />;
                                        break;
                                    case "BANK_NAME":
                                        comp = <BankListComponent id={self.props.params.id} key={index} {...el} setForms={(data) => self.commFrom(data)}/>;
                                        break;
                                    case "BANK_CARD_NUM":
                                        comp = <BankCardComponent key={index} {...el} setForms={(data) => self.commFrom(data)} formTips={(msg) => self.formTips(msg)} />;
                                        break;
                                    case "EFFECTIVE_DATE":
                                        el.optional ?
                                            comp = <DateRangeComponent key={index} {...el} setForms={(data) => self.commFrom(data)}/>
                                            : comp = <DateShowComponent {...el} key={index} setForms={(data) => self.commFrom(data)}/>
                                        break;
                                    case "ORDER_ADDRESS":
                                        comp = <AddressComponent key={index} {...el} setForms={(data) => self.getAddress(data)} layFn={(data) => self.showAddModal(data)} value={self.state.myaddress}/>
                                        break;
                                    case "EMAIL":
                                        comp = <CommonInputComponent key={index} {...el} inputType="email" regx={methods.regex.email} setForms={(data) => self.commFrom(data)} formTips={(msg) => self.formTips(msg)}/>
                                        break;
                                    case "CITY_ADDRESS":
                                    case "CITY_ADDRESS_NEW":
                                        comp = <CommonInputComponent key={index} {...el} inputType="text" regx={methods.regex.detailaddress} setForms={(data) => self.commFrom(data)} formTips={(msg) => self.formTips(msg)}/>
                                        break;
                                    case "JOB":
                                        comp = <CommonCascadeInput key={index} {...el} showOcc={() => self.commonShowModal("commonCascade",{"name":el.name,"index":index,"ajaxType":"JOB"})} />;
                                        break;
                                    case "IMEI":
                                        comp = <ImeiComponent key={index} {...el} setForms={(data) => self.commFrom(data)} formTips={(msg) => self.formTips(msg)} />;
                                        break;
                                    case "ZIP_CODE":
                                        comp = <CommonInputComponent key={index} {...el} inputType="number" regx={methods.regex.zipcode}  setForms={(data) => self.commFrom(data)} formTips={(msg) => self.formTips(msg)}/>;
                                    case "EDITABLE_IMEI":
                                        comp = <ImeiExComponent key={index} {...el} regx={methods.regex.imei} setForms={(data) => self.commFrom(data)} formTips={(msg) => self.formTips(msg)} />;
                                        break;
                                    default:
                                        comp = <CommonInputComponent key={index} {...el} inputType="text" regx={methods.regex.name}  setForms={(data) => self.commFrom(data)} formTips={(msg) => self.formTips(msg)}/>
                                        break;
                                }
                                return (
                                    comp
                                )
                            })
                        }
                    </ul>
                }
                {
                    self.state.forms && <div className="ins-border btm-bl whiteframe">
                        <Tickets id={self.props.params.id} premium={self.state.premium} getCoupon={(data) => self.getCoupon(data)} />
                    </div>
                }
                {
                    self.state.showCheck && self.state.showCheck.showReadTerms && <div ref="check" className="ins-check ins-gray">
                        <input type="checkbox" onChange={(e) => {this.setState({checked: e.target.checked})}}/>我已经认真阅读
                        {
                            self.state.showCheck &&
                            self.state.showCheck.termList.map(function (el,index) {
                                return (
                                    <a className="ins-orange" title={el.name} href={el.content + "?mifi_download=true"}>《{el.name}》</a>
                                )
                            })
                        }
                        ，了解并接受包括有关责任条款及免除责任条款等约定。
                    </div>
                }
                {button}
                <Loading transparent={true} isLoading={self.state.isLoading}/>
                <Notifications/>
                <CommonCascade show={self.state.showCascadeModal} id={self.props.params.id} emitFn={(data,pos) => self.commCascadeFrom(data,pos)} hidePop={() => self.commonShowModal("commonCascade_hide")} />
                <Address show={self.state.showit} unsave={true} type={self.state.addressType} init={self.state.addressJson} onClick={(res) => {self.getAddress(res)}}/>
                <Measure type="inner" id={self.props.params.id} fn={(data) => self.getChoosed(data)} closeModal={() => self.commonShowModal("Support_hide")} show={self.state.showModal}/>
            </div>
        )
    }
}