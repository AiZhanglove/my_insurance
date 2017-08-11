import React from 'react';
import methods from '../assets/methods.js';
import HeadsComponent from './HeadsComponent.jsx';
import SafeGuardComponent from './SafeGuardComponent.jsx';
import {Tabs,TabPane} from '../components/tab/index.jsx';
import FaqComponent from './FaqComponent.jsx';
import BriefComponent from './BriefComponent.jsx';
import ImgListComponent from './ImgListComponent.jsx';
import Button1 from '../components/Button1.jsx';
import Measure from '../components/MeasureComponent.jsx';

require("../components/Product.css");
require("../components/ProductList.less");
require("../frame/frame.less");

//变量
const tabs = [
    {
        id:1,
        title: "产品详情",
        isOpen: 1,
        stat:"ins_prod_"
    },
    {
        id:2,
        title: "购买须知",
        isOpen: 0,
        stat:"ins_notes_"
    },
    {
        id:3,
        title: "常见问题",
        isOpen: 0,
        stat:"ins_qa_"
    }
];
const tabslite = [
    {
        id:1,
        title: "购买须知",
        isOpen: 1,
        stat:"ins_notes_"
    },
    {
        id:2,
        title: "常见问题",
        isOpen: 0,
        stat:"ins_qa_"
    }
];
export default class FrameDetail extends React.Component{
	constructor(props){
		super(props);
		this.state={
			lists: tabs,
            fixeds: '',
            intro:'',
            details:'',
            showSelectPage:true,
            showModal:false,
            hasChoosed:'',
            showHealthTerms:false
		}
	}
	componentWillMount(){
		var self = this;
        //写入产品id 为在结果页判断显示
        localStorage.productId = self.props.params.id;
        //为碎屏险存储imei
        localStorage.iMeiStr = methods.getParam("imei") || "";
        //统计方法
        MiFiLoantracker({
            pageTitle: 'ins_detail_' + self.props.params.id,
            productType:"insurance"
        });
        window.onReload = function () {
            //nothing to do void reload page
        }
	}
	componentDidMount(){
		var self = this;
		self.getDetail();
		self.getLists();
		        //滚动方法
        self.srollFuc();
	}

	getLists(){
        var self = this;
        methods.Ajax({
            type:'GET',
            url:'/v1/insurance/product/productDetailExtras',
            params:{
                productId:self.props.params.id
            },
            success:function(data){
                if(data.success){
                    var lists = tabslite
                    if(data.showFeature && data.feature && data.feature.length > 0 ){
                        lists = tabs
                    }
                    self.setState({
                        details:data,
                        lists:lists
                    })
                }
            }
        })
    }

    changePosition(bol){
        var oTab = document.querySelector(".ins-tabs__tab");
        var oWrap = document.querySelector("#tabcontainer-js");
        if(bol){
            oTab.style.cssText="position:fixed;top:0;left:0;width:100%";
            oWrap.style.paddingTop = "46px";
        }else{
            oTab.style.cssText="";
            oWrap.style.paddingTop = "0";
        }
    }
	srollFuc(){
        var self = this;
        var nav = document.querySelector("#tabcontainer-js");
        var navOffsetY = nav.getBoundingClientRect().top + 10;
        function onScroll(e) {
            navOffsetY = nav.getBoundingClientRect().top + 10;
            navOffsetY <= 10 ? self.changePosition(true) : self.changePosition(false);
        }
        window.addEventListener('scroll', onScroll);
    }
	getDetail(){
        var self = this;
        methods.Ajax({
            type:'GET',
            url:'/v1/insurance/product/productDetails',
            params:{
              productId:self.props.params.id
            },
            success:function(data){
                if(data.success){
                    self.setState({
                        fixeds:data.listProductDetails,
                        intro:data.intro,
                        showSelectPage:data.listProductDetails.showSelectPage,
                        showHealthTerms:data.listProductDetails.showHealthTerms
                    });
                    //重新设置标题
                    if(data.intro.salesName){
                        document.title = data.intro.salesName;
                    }
                    //分享
                    if(data.listProductDetails.showShareButton){
                        methods.setMenu({
                            "text": data.intro.intro + data.intro.upperCase + data.intro.lowerCase,
                            "subject": data.intro.salesName || "小米保险",
                            "url": window.location.href,
                            "imageUrl": data.listProductDetails.headUrl,
                            "id":"ins_share_" + self.props.params.id
                        });
                    }
                }
            }
        })
    }
    formatHtml(str){
        return str.replace(/\r|\n/g, '<br>');
    }
    
    showModalFn(){
        var self = this;
        self.setState({
            showModal:true
        })
    }
	hideModal(){
        var self = this;
        self.setState({
            showModal:false
        })
    }

    gotoBuy(){
        var self = this;
        var urlData = {
            url:"frame.html",
            router:"#/inform/" + self.props.params.id,
            title:"健康告知",
            urlParams:{
                from:methods.getParam("from") || "local",
                source:methods.getParam("source") || "p0",
                couponFrom:methods.getParam("couponFrom") || "couponDefaultLocal"
            }
        };
         //登陆
        methods.commonLogin({
            callback:function(){
                if(self.state.showSelectPage || self.state.hasChoosed == ''){
                    self.showModalFn();
                }else{
                    if(self.state.showHealthTerms){
                        methods.newStartActivity(urlData)
                    }else{
                        urlData.router = "#/buy/" + self.props.params.id;
                        urlData.title = "填写保单";
                        methods.newStartActivity(urlData)
                    }
                }
            },
            failCallback:function(){}
        });
    }

    getChoosed(data){
        var self = this;
        self.setState(data, function () {
            if(self.gotoBuy && data.canJump){
                self.gotoBuy();
            }
        })
    }
	render(){
		let self = this;
		let heads = {
            fixeds: self.state.fixeds || '',
            id: self.props.params.id,
            intro: self.state.intro || ''
        };

		return(
			<div className="fixbtn-wrap">
				<HeadsComponent {...heads}/>
				<div className="ins-border test-premium" onClick={() => self.showModalFn()}>
					<span className="test-premium-title">选择投保方案</span>
                    <span className="test-premium-choosed">{self.state.hasChoosed}</span>
				</div>
				<SafeGuardComponent show={true} title="保障责任" id={self.props.params.id}/>
				<div className="tab-container ins-border" style={{paddingTop:"0"}} id="tabcontainer-js">
                    <Tabs>
                        {
                            self.state.lists.map(function (el, index) {
                                let briefs = {
                                    details:self.state.details,
                                    fixeds:self.state.fixeds,
                                    tel:methods.regex.tel
                                };
                                return (
                                    <TabPane key={index} tabId={el.id} title={el.title}>
                                        {(el.stat == "ins_prod_" && self.state.details) && <ImgListComponent className="ins-imglist__pd" lists={self.state.details.feature}/>}
                                        {(el.stat == "ins_notes_" && self.state.details && self.state.fixeds) && <BriefComponent {...briefs} />}
                                        {(el.stat == "ins_qa_" && self.state.details) && <FaqComponent formatHtml={(str)=>self.formatHtml(str)} lists={self.state.details.question} />}
                                    </TabPane>
                                )
                            })
                        }
                    </Tabs>
                </div>
				<Button1 onClick={()=>this.gotoBuy()} value="立即购买"/>
                <Measure title="立即投保" id={self.props.params.id} fn={(data) => self.getChoosed(data)} closeModal={() => self.hideModal()} show={self.state.showModal}/>
			</div>
		)
	}
}