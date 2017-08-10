import React from 'react';
import methods from '../assets/methods.js';
import NoContent from '../components/NoContent.jsx';
import Button1 from '../components/Button1.jsx';

require('./AssetList.css');
require('./carList.css');
require('./MyCar.css');
export default class CarOrderDetail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            disabled:false
        }
    }

    pushStat(){
        //统计方法
        MiFiLoantracker({
            pageTitle: 'p13',
            productType:"insurance"
        });
        window.location.href = this.props.jsons.common.policyUrl + "?mifi_download=true";
    }

    getLists(el,index){
        var self = this;
        var j = 1;
        var arr = []
        if (index == 1) {
            j += 10;
        }
        var timeSection = methods.date(parseInt(el.startTime)) + "至" + methods.date(parseInt(el.endTime));

        var newEl = {};

        for(let k in el) {
            if (el.policyNo == "") {
                newEl.policyNo = "暂无";
            }
            var a = k;
            if (k != "status" && k != "premium" && k != "title" && k != "type" && k != "endTime" && k != "productSource" && k != 'vehicleId' && k != 'payStatus' && k != 'productId' && k != 'proposalTime' && k != 'insureProvince' && k != 'insureCity' && k != 'channel') {
                if (k == "clause") {
                    a = "保险条款";
                    newEl[k] = el[k];
                }
                if (k == "policyNo") {
                    a = "保单号";
                    newEl[k] = el[k] ? el[k] : "暂无";
                }
                if (k == "startTime") {
                    a = "保障期限";
                    newEl[k] = timeSection;
                }
                arr.push(<li key={j}><span className="col-left col-3">{a}</span><span className="col-right col-7 text-right" dangerouslySetInnerHTML={{__html: newEl[k]}}></span></li>)
                j++;
            }
        }
        // console.log(arr)
        return arr;
    }

    rePay(){
        var self = this;
        var mysource = methods.getParam("source") || 'p0';
        var myfrom = methods.getParam("from") || 'local';
        var productId = methods.getParam("productId");
        var myurl = location.protocol+'//'+location.host+'/insurance/insurance.html?source='+mysource+'&from='+myfrom+'&status=fail#/carresult';
        // var myurl = location.protocol+'//'+location.host+'/insurance.html?source='+mysource+'#/result/fail';


        if (!self.state.disabled) {
            self.setState({
                disabled:true
            })
            methods.Ajax({
                type:'POST',
                url:'/v1/insurance/vehicle',
                data:{
                    params:JSON.stringify({
                        action: "Repay",
                        orderId: localStorage.carDetailOrderId || '',
                        amt: self.props.jsons.coverage.sumPreimum,
                        from: myfrom,
                        source:mysource,
                        vehicleId: self.props.jsons.detail[0].vehicleId,
                        productId: productId
                    })
                },
                success:function(data) {
                    self.setState({
                        disabled:false
                    })
                    // methods.setReload&&methods.setReload(true, 'carensureorder');
                    if(data.success){
                        var payUrl = data.data["payUrl"];
                        methods.startActivity(payUrl,'支付')
                    }else{
                        methods.startActivity(myurl,'支付结果')
                    }
                },
                error:function(status) {
                    console.log(status)
                }
            })
        }
        //统计方法
        MiFiLoantracker({
            pageTitle: 'p84',
            productType:"insurance"
        });
    }

    receiveBounty(){
        var productId = methods.getParam('productId');
        var myurl = location.protocol + '//' + location.host + '/insurance/document/new_receive_bounty_car.html';
        methods.startActivity(myurl, '领取补贴');

        //统计方法
        MiFiLoantracker({
            pageTitle: '保险_车险_保单详情_领取商业险补贴按钮',
            productType:"insurance"
        });
    }

    receiveSubsidies(){
        var productId = methods.getParam('productId');
        var myurl = location.protocol+'//'+location.host+'/insurance/document/receiveSteps_car.html?productId='+productId;
        methods.startActivity(myurl,'领取补贴');

        //统计方法
        MiFiLoantracker({
            pageTitle: '保险_车险_保单详情_领取优惠按钮',
            productType:"insurance"
        });
    }

    receiveRealGift(fg){
        // var productId = methods.getParam('productId');
        // if (fg) {
        //     var myurl = location.protocol+'//'+location.host+'/insurance/document/new_receive_subsidy_car.html?tsdq='+fg+'&productId='+productId;
        // } else {
        //     var myurl = location.protocol+'//'+location.host+'/insurance/document/new_receive_subsidy_car.html?productId='+productId;
        // }
        // methods.startActivity(myurl, '实物礼品');
        //
        // //统计方法
        // MiFiLoantracker({
        //     pageTitle: '保险_车险_保单详情_特殊地区领取实物按钮',
        //     productType: "insurance"
        // });

        var myurl = location.protocol+'//'+location.host+'/insurance/document/new_recive_summer_subsidy_car.html';
        methods.startActivity(myurl, '领取步骤');

        //统计方法
        MiFiLoantracker({
            pageTitle: '保险_车险_保单详情_跳转盛夏活动按钮',
            productType: "insurance"
        });
    }

    toTwoDecimalPlaces(param){ /*转为两位小数*/
        var str = param.toString();
        if (str.indexOf('.') != -1) {
            var idx = str.indexOf('.');
            if ((str.length - idx) == 2) {
                str = str + '0';
            }
        } else {
            str = str + '.00';
        }
        return str;
    }

    isFalse(val) {
        if (val == '0.00' || val == '0' || val == '0.0' || val == null || val == undefined || val == 'null' || val == 'undefined' || val == '' || val == 0) {
            return false
        } else {
            return true
        }
    }

    render(){
        var self = this;
        var myfrom = methods.getParam("from") || 'local';
        var productId = methods.getParam('productId');
        var caseStatus = methods.getParam('casestatus');
        var cont = this.props.jsons.detail;
        var el = this.props.jsons.common;

        var proposalTime = cont.length ? cont[0]['proposalTime'] : 0; //投保时间
        var channel = cont.length ? cont[0]['channel'] : '';          // 购买时的渠道

        var carShowIns = this.props.jsons.coverage;
        var cplSumPreimum = (parseFloat(carShowIns.compelSumPreimum)*100 + parseFloat(carShowIns.taxPreimum)*100)/100;  //交强险总额

        var button = '';
        var flag = false;

        for (var i = 0; i < cont.length; i++) {
            if(cont[i].payStatus == '5'){
                flag = true;
                break;
            }
        }

        if (caseStatus && caseStatus == 'success') {
            flag = false;
        }

        if (flag) {
            button = <Button1 value="再次支付" onClick={()=>this.rePay()}/>
        }

        var isOldProposalTime = false;   //是否是商业险补贴时间之外的保单
        if (proposalTime > new Date('2017/04/01').setHours(0,0,0,0) && proposalTime < new Date('2017/05/01').setHours(0,0,0,0)) {
            isOldProposalTime = true;
        }

        var cashStr = '', subsidy = '', coupon ='', oilCard ='', giftCard ='', giftList = '', hasSubsidy = false;
        if (el.subsidy == '0' && el.coupon == '0' && el.oilCard == '0' && el.giftCard == '0') {
            cashStr = '';
        } else {
            cashStr = '领取';
            if (el.subsidy != '0') {
                if (isOldProposalTime) {
                    hasSubsidy = true;
                    subsidy = '商业险补贴¥' + el.subsidy/100;
                } else {
                    hasSubsidy = false;
                    subsidy = '补贴¥' + el.subsidy/100;
                }
            }
            if (el.coupon != '0') {
                coupon = '红包¥' + el.coupon/100;
            }
            if (el.oilCard != '0') {
                oilCard = '油卡¥' + el.oilCard/100;
            }
            if (el.giftCard != '0') {
                giftCard = '礼品卡¥' + el.giftCard/100;
            }
        }

        if (subsidy) {subsidy += "+"}
        if (coupon) {coupon += "+"}
        if (oilCard) {oilCard += "+"}
        if (giftCard) {giftCard += "+"}

        cashStr += subsidy+coupon+oilCard+giftCard;
        cashStr = cashStr.substring(0, cashStr.length-1);

        var insureProvince = cont.length ? cont[0]['insureProvince'] : '';  //投保省份
        var insureCity = cont.length ? cont[0]['insureCity'] : '';  //投保城市

        // var fg = '';
        // if (!flag && channel != 'ins_agent') {
        //     if (insureProvince == '北京市') {
        //         fg = 'bj';
        //     }
        //     if (insureProvince == '新疆维吾尔自治区') {
        //         fg = 'xj';
        //     }
        //     if (insureProvince == '山西省') {
        //         fg = 'sh';
        //     }
        //     if (insureProvince == '湖北省') {
        //         fg = 'hb';
        //     }
        //     if (insureProvince == '广东省' && insureCity == '深圳市') {
        //         fg = 'sz';
        //     }
        // }

        var fg = 'true';
        if (!flag && channel != 'ins_agent' && channel != 'ins_car_nongfenqi') {
            if (insureProvince == '四川省' || (insureProvince && insureCity == '大连市')) {
                fg = '';
            }
        }
        if (channel == 'ins_agent' || channel == 'ins_car_nongfenqi') {
            fg = '';
        }
        if (flag) {
            fg = '';
        }

        if (el.giftList) {
            if (el.giftList.length) {
                giftList = '领取' + el.giftList.join('+');
            } else {
                fg = '';
            }
        } else{
            fg = '';
        }

        return (
            <div className="car-container" style={button ? {paddingBottom:"69px"} : {}}>
                <div className="mod-show-ins_top mod-order-ins_wrap">
                    <img className="ins_top_logo" style={{width: '14%'}} src={productId == "36" ? "https://ts.market.mi-img.com/thumbnail/png/q80/Finance/088dbe4429a6f467f2b2e74d20912bd00d280b6c2" : "/images/insurance/logo.png"} />
                    <div className="ins_top_cont">
                        <div className="cont_wrap_top">
                            <span className="title bold">{decodeURI(el.vehicleLicencePlateNo)}</span>
                            <span className="title" style={{fontSize:'14px', color:'#999'}}>{el.insured}</span>
                        </div>
                        <div className="cont_wrap_bottom" style={{paddingTop: '4px', paddingRight: '0'}}>
                            <span className="price ins-red">{el.premium/100}<small>元</small></span>{/*cashStr ? <span className="act ins-red" onClick={hasSubsidy ? () => self.receiveBounty() : () => self.receiveSubsidies()}><span className="act_cont">{cashStr}</span></span> : (fg ? <span className="act ins-red" onClick={() => self.receiveRealGift(fg)}><span className="act_cont">{giftList}</span></span> : '')*/}
                        </div>
                    </div>
                </div>
                {
                    el.recipienterAddress ? <div className="mod-car-order_dispatch border-bottom">
                        <h2 className="bold">保单配送信息</h2>
                        <div className="add-info bold">
                            <img className="" src="/images/insurance/car_order_geo.png" />收货人：<span className="">{el.recipienterName}</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{el.recipienterPhone}
                        </div>
                        <div className="address">
                            {'收货地址：' + el.recipienterAddress}
                        </div>
                    </div> : ''
                }
                <div className="mod-show-ins_bottom border-bottom car-order-new-padding">
                    <div className="show_ins_wrap_top">
                        <span className="text-left left bold">保单详情</span>
                    </div>
                    <div className="show_ins_wrap_bottom">
                        <div className="list_title">
                            <span className="list_title_left text-left bold">险种</span>{/*<span className="list_title_center text-center bold">保额</span>*/}<span className="list_title_right text-right bold">保费</span>
                        </div>
                        {
                            carShowIns ? <div className="ins_lists_cont">
                                <span className="ins_lists_cont_title text-left bold">商业</span><span className="ins_lists_cont_title aa text-right">&yen;{carShowIns.businessSumPreimum}</span>
                                {
                                    carShowIns && carShowIns.coverageInfoList && carShowIns.coverageInfoList.length ? carShowIns.coverageInfoList.map(function(el, index) {
                                        return (
                                            <div key={index}><span className="left">{el.coverageName + (!self.isFalse(el.sumInsured) ? '' : (el.coverageName.indexOf('不计免赔') != -1 ? '' : (el.coverageName.indexOf('机动车损失保险') != -1 ? ("（" + ((el.sumInsured)/10000).toFixed(1) + "万）") : ("（" + (el.sumInsured)/10000 + "万）"))))}</span>
                                                {/*<span className="center text-center">{!self.isFalse(el.sumInsured) ? '' : (el.coverageName.indexOf('不计免赔') != -1 ? '' : (el.coverageName.indexOf('机动车损失保险') != -1 ? (((el.sumInsured)/10000).toFixed(1) + "W") : (el.sumInsured)/10000 + "W"))}</span>*/}
                                                <span className="text-right right">&yen;{self.toTwoDecimalPlaces(el.coveragePreimum)}</span>
                                            </div>
                                        )
                                    }) : ''
                                }
                                {
                                    carShowIns && carShowIns.taxPreimum && carShowIns.compelSumPreimum ? <div>
                                        <span className="ins_lists_cont_title text-left bold">交强</span><span className="ins_lists_cont_title aa text-right">&yen;{self.toTwoDecimalPlaces(cplSumPreimum)}</span>
                                        <span className="left">交强险</span><span className="center text-center"></span><span className="text-right right">&yen;{self.toTwoDecimalPlaces(carShowIns.compelSumPreimum)}</span>
                                        <span className="left">{insureCity == "天津市" ? "车船税（暂未开通代缴功能）" : "车船税"}</span><span className="center text-center"></span><span className="text-right right">&yen;{self.toTwoDecimalPlaces(carShowIns.taxPreimum)}</span>
                                    </div>
                                        : ''
                                }
                            </div> : ''
                        }
                    </div>
                </div>
                {
                    cont.length ? cont.map(function(el, index) {
                        return (
                            <div key={index} className="ins-list-wrap commercial-ins">
                                <div className="title border car-detail-order-status">
                                    <span className="col-left col-3 bold">{el.title}</span><span className="col-right col-7 text-right car-new-status">{/*el.status != '' ? (el.status == 'ISSUED' ? '待起保' : methods.statusFilter(el.status)) : ''*/}</span>
                                    <div className={"car-detail-order-status-img " + "car-detail-order-status-" + el.status.toLowerCase()}></div>
                                </div>
                                <ul className="detail" ref="commercial">
                                    {
                                        el["title"] ? self.getLists(el,index) : ""
                                    }
                                    <li><span className="col-left col-3">理赔电话</span>
                                        {
                                            productId == '16' ? (el['productSource'] == '1' ? <span className="col-right col-7 text-right">众安全国客服热线<a className="ins-red" href="tel:400-999-9595">400-999-9595</a></span>
                                                : <span className="col-right col-7 text-right">平安全国客服热线<a className="ins-red" href="tel:95511">95511</a></span>)
                                                : ( productId == '36' ? <span className="col-right col-7 text-right">安心全国客服热线<a className="ins-red" href="tel:400-88-45678">400-88-45678</a></span>
                                                : ( productId == '17' ? (
                                                el['productSource'] == '10000' ? <span className="col-right col-7 text-right">中国人保全国客服热线<a className="ins-red" href="tel:95518">95518</a></span> :
                                                    el['productSource'] == '25000' ? <span className="col-right col-7 text-right">太平洋保险全国客服热线<a className="ins-red" href="tel:95500">95500</a></span> :
                                                        el['productSource'] == '15000' ? <span className="col-right col-7 text-right">阳光保险全国客服热线<a className="ins-red" href="tel:95510">95510</a></span> :
                                                            el['productSource'] == '45000' ? <span className="col-right col-7 text-right">中华保险全国客服热线<a className="ins-red" href="tel:95585">95585</a></span> :
                                                                el['productSource'] == '40000' ? <span className="col-right col-7 text-right">中国人寿全国客服热线<a className="ins-red" href="tel:95519">95519</a></span> : ''
                                            ): ''))
                                        }
                                    </li>
                                </ul>
                                {/*<div className="ins-price">
                                 <span className="col-left col-3 bold">保费</span><span className="col-right col-7 text-right">{el.premium+"元"}</span>
                                 </div>*/}
                            </div>
                        )
                    }) : <NoContent/>
                }
                {button}
            </div>
        )
    }

}