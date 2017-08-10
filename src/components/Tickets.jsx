import React from 'react';
import methods from '../assets/methods.js';
import config from  '../assets/config.js';
require("./Tickets.less");
export default class Tickets extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            lists:[],
            couponLimit: 2000,
            coupontips: 0,
            hasCoupon:false,
            showModal:false
        };
    }

    getTickets(data){
        var self = this;
        methods.Ajax({
            type: 'GET',
            url: config.api + 'getCoupons',
            params: data,
            success: function (data) {
                if(data.count >= 1){
                    var res = data.tickets[0];
                    if(res.status == 1){
                        res.selected = true;
                        self.setState({
                            lists:data.tickets,
                            couponLimit:res.minAmount,
                            coupontips:res.preferentialAmount,
                            hasCoupon:true
                        });
                        //回传给父组件
                        self.emit({
                            "id":res.id,
                            "couponAmount":res.preferentialAmount,
                            "limit":res.usedAmount
                        });
                    }else{
                        self.setState({
                            lists:data.tickets,
                            coupontips:0,
                            hasCoupon:false
                        });
                        //回传给父组件
                        self.emit({
                            "id":'',
                            "couponAmount":0,
                            "limit":0
                        });
                    }

                }else{
                    console.log(data);
                    self.setState({
                        hasCoupon:false
                    });
                }
            },
            error: function (status) {
                console.log(status)
            }
        })
    }

    showTickets(){
        var self = this;
        self.setState({
            showModal:true
        })
    }

    filterFn(index,bol){
        var self = this;
        var info = self.state.lists;
        info.map(function (el, indx) {
            if(index == indx){
                el.selected = bol;
            }else if(bol){
                el.selected = !bol;
            }else{
                el.selected = bol;
            }
        });
        self.setState({
            lists:info
        })
    }

    choose(el,index){
        var self = this;
        if(el.selected){
            self.filterFn(index,false);
        }else{
            self.filterFn(index,true);
        }
        //
        self.setState({
            showModal:false,
            coupontips:el.selected ? el.preferentialAmount : 0
        })
        self.emit({
            id:el.selected ? el.id : '',
            couponAmount:el.selected ? el.preferentialAmount : 0,
            limit:el.selected ? el.usedAmount : 0
        });
    }

    cancel(){
        this.setState({
            showModal:false
        })
    }

    componentWillReceiveProps(nextProps){
        var self = this;
        if(nextProps.premium > 0 && nextProps.premium != self.props.premium){
            this.getTickets({
                productId:localStorage.productId,
                premium:nextProps.premium
            });
        }
    }

    componentDidMount() {
        var self = this;
        if(self.props.premium){
            self.getTickets({
                productId:localStorage.productId,
                premium:self.props.premium
            });
        }
        //写cookie的回调
        window.componetCallback = function () {
            self.getTickets({
                productId:localStorage.productId,
                premium:self.props.premium
            });
        }
    }

    emit(id){
        this.props.getCoupon(id);
    }

    render() {
        var self = this;
        return (
            <div className="tickets-box-wraper">
                {self.props.gap ? <div className="border">&nbsp;</div> : ''}
                <div className="tickets-box border" onClick={() => self.showTickets()}>
                    <label>红包</label>
                    <span className="tickets-value">{ self.state.hasCoupon ? self.state.coupontips > 0 ? "立减" + methods.fen2Yuan(self.state.coupontips,2) + "元" : "请选择" : "暂无可用"}</span>
                </div>
                <div className="tickets-listbox" ref="ticketsModal" style={{display: self.state.showModal ? "block" : "none"}}>
                    <ul className="tickets-list">
                        {
                            self.state.lists.length > 0 ? self.state.lists.map(function (el, index) {
                                return (
                                    <li key={index} className={el.status != "1" ? 'disabled' : ''} onClick={() => self.choose(el,index)}>
                                        <div className="tickets-list-title">
                                            {el.productName ? el.productName : ''}
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            {el.type}
                                            {el.selected ? <span className="check-icon"></span> : ''}
                                        </div>
                                        <div className="tickets-list-body">
                                            <div className="tickets-list-content">
                                                <div className="left">
                                                    <strong className="price">
                                                        {methods.fen2Yuan(el.preferentialAmount,2)}
                                                    </strong>
                                                    元
                                                </div>
                                                <div className="right">
                                                    <h4>使用条件</h4>
                                                    <p>{el.condition}</p>
                                                </div>
                                            </div>
                                            <div className="tickets-list-date">有效期至{el.expireTime}</div>
                                        </div>
                                        <div className="tickets-list-foot text-right">
                                            使用状态: {el.statusDesc}
                                        </div>
                                    </li>
                                )
                            }) : <div className="text-center" style={{paddingTop:"30vh"}}>暂无优惠券</div>
                        }
                    </ul>
                    <div className="tickets-bar">
                        <div className="ins-button" >
                            <div className="content">
                                <div className="a white loan-border">
                                    <a onClick={()=>self.cancel()}  href="javascript:;" title="取消">取消</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}