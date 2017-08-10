import React from 'react';
import Button1 from './Button1.jsx';
require('./AssetList.css');
import methods from '../assets/methods.js';
export default class OrderDetail extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            disabled:false
        }
    }
    pushStat(web){
        //统计方法
        MiFiLoantracker({
            pageTitle: 'p13',
            productType:"insurance"
        });
        if(!web){
            window.location.href = this.props.jsons.common.policyUrl + "?mifi_pdf=true";
        }else{
            methods.startActivity(web,"");
        }
    }

    renew(){
        var self = this;
        var mysource = methods.getParam("source");
        var myurl = location.protocol+'//'+location.host+'/insurance/insurance.html?source='+mysource+'#/result/fail';
        self.setState({
            disabled:true
        })
        methods.Ajax({
            type: 'POST',
            shoudLogin: true,
            url: '/v1/insurance/renewRecord',
            params:{
                id:localStorage.renewId,
                recordId:self.props.jsons.renewRecords[0].id
            },
            success: function (data) {
                methods.setReload(true, 'old_buy2');
                self.setState({
                    disabled:false
                })
                if(data.success){
                    //新收银台
                    if(data.payCenterUrl){
                        methods.startActivity(data.payCenterUrl,'支付中心')
                        return false;
                    }
                    methods.startActivity(data.bindUrl,'小米钱包')
                }else{
                    methods.startActivity(myurl,'支付结果')
                }
            },
            error: function (status) {
                console.log(status);
                self.setState({
                    disabled:false
                })
                methods.startActivity(myurl,'支付结果')
            }
        })
    }
    //继续付款
    repay(){
        var self = this;
        var mysource = methods.getParam("source");
        var myurl = location.protocol+'//'+location.host+'/insurance/insurance.html?source='+mysource+'#/result/fail';
        self.setState({
            disabled:true
        })
        methods.Ajax({
            type: 'POST',
            url: '/v1/insurance/pay',
            params:{
                orderId:self.props.orderId
            },
            success: function (data) {
                var j;
                var params=[];
                var one;
                var url ='https://api.ucashier.mipay.com/api/trade/doWapCreate?';
                self.setState({
                    disabled:false
                });
                //
                if(data.success){
                    //新收银台
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
                }else{
                    methods.startActivity(myurl,'支付结果')
                }
            },
            error: function (status) {
                console.log(status);
                self.setState({
                    disabled:false
                })
                methods.startActivity(myurl,'支付结果')
            }
        })
    }

    renewProduct(){
        var self = this;
        var common = self.props.jsons.common;
        var renewInfo  = self.props.jsons.renewDetails;
        //统计方法
        MiFiLoantracker({
            pageTitle: 'ins_renewentry_' + common.productId,
            productType:"insurance"
        });
        methods.startActivity(renewInfo.renewal_action_url,renewInfo.renewal_action_title || "");
    }

    render() {
        var myfrom = methods.getParam("from") || localStorage.from ||  "local";
        var cont = this.props.jsons.detail;
        var el = this.props.jsons.common;
        var renewInfo  = this.props.jsons.renewDetails;
        var statusClass = 'od-status od-status-'+el.status.toLowerCase(); //展示不同的状态
        var btnClass = el.policyDownButtonActive ? 'teal' : 'teal disabled';
        var deathClass = 'teal disabled';
        var btn2class = el.policyDownButtonActive ? '' : 'disabled';
        var buyclass = this.state.disabled ? 'a teal loan-border disabled' : 'a teal loan-border';
        var tag = [];
        for (var k in cont) {
            tag.push(<li className="border" key={k}><span className="col-left col-3" dangerouslySetInnerHTML={{__html: k}}></span><span className="col-right col-7 text-right" dangerouslySetInnerHTML={{__html: cont[k]}}></span></li>)
        }
        //老人险的按月续保
        if(this.props.jsons.renewRecords.length > 0){
            var showbtn = <Button1 class="teal" onClick={()=>this.renew()} value="去续费"/>
            var currentData = this.props.jsons.renewRecords[0];
            var currMonth = new Date(parseInt(currentData.beginTime)).getMonth() + 1;
        }else if(renewInfo.renewable){ //产品的续保
            var showbtn = <Button1 class="teal" onClick={()=>this.renewProduct()} value={el.renewal_button_text || "立即续保"}/>
        }else{
            if(el.canPay){
                var showbtn = <Button1 class="a frame-btn-color teal" onClick={()=>this.repay()} title="立即支付" value="立即支付"/>
            }else if(myfrom == "mitulocal"){
                var showbtn = <Button1 class={deathClass} onClick={()=>this.pushStat()} title="去安心保险官网查询电子保单" value="去安心保险官网查询电子保单"/>
            }else{
                var showbtn = el.policyDownButtonActive ? <Button1 class={btnClass} onClick={()=>this.pushStat()} value={el.policyDownButtonText || "下载保单"}/> :
                                                          <Button1 class={btnClass} value={el.policyDownButtonText || "下载保单"}/>
            }
        }
        //
        return (
            <div>
                {
                    <div className="od-container">
                        <div className="od-header">
                            <div className="od-info">
                                <div className="integer">
                                    <strong>{ el.sumInsured >= 1000000 ? methods.fen2Wan(el.sumInsured) : methods.fen2Yuan(el.sumInsured)}</strong>
                                    <span>{el.sumInsured >= 1000000 ? "万" : "元"}</span>
                                </div>
                                <p>保障额度</p>
                                <h4>被保险人:{el.insured}</h4>
                            </div>
                            <div className={statusClass}></div>
                        </div>
                        {
                            this.props.jsons.renewRecords.length > 0 &&
                            <ul className="arrears-tips">
                                <li><i></i>您{currMonth}月保费为{methods.fen2Yuan(currentData.premium,2)}元,请于<span className="ins-red">{methods.date(currentData.payEndTime)}</span>前完成续费 </li>
                                <li><i></i>我已阅读并同意 <a className="ins-red" title="自动扣款协议" href="document/autocharge_old.html">《自动扣款协议》</a></li>
                            </ul>
                        }
                        {
                            renewInfo && renewInfo.prompt && renewInfo.renewable &&
                            <ul className="arrears-tips">
                                <li><i></i><a className="ins-red" title="续保" href={renewInfo.redirect_url}>{renewInfo.prompt}</a></li>
                            </ul>
                        }
                        {
                            el.canPay && <ul className="arrears-tips">
                                <li><i></i>请在{methods.date(el.payEndTime,true)}前完成支付,逾期订单将取消</li>
                            </ul>
                        }
                        <div>
                            <ul className="health-list">
                                {tag}
                            </ul>
                        </div>
                        {showbtn}
                    </div>
                }
            </div>
        )
    }
}