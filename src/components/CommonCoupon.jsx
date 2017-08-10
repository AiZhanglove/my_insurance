import React from 'react';
import methods from '../assets/methods.js';
import config from  '../assets/config.js';
export default class CommonCoupon extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            couponLimit: 2000,
            coupontips: "立即支付，红包可抵扣6元",
            hasCoupon:false
        };
    }

    getTickets(){
        var self = this;
        methods.Ajax({
            type: 'GET',
            url: config.api + 'getTickets',
            params: {
                productId:localStorage.productId
            },
            success: function (data) {
                if(data.count >= 1){
                    var res = data.tickets[0];
                    self.setState({
                        couponLimit:res.minAmount,
                        hasCoupon:true
                    });
                    //回传给父组件
                    self.emit({
                        "id":res.id,
                        "limit":res.minAmount,
                        couponAmount:res.amount
                    });
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

    componentDidMount() {
        var self = this;
        if ((methods.getCookie('userId') || methods.getCookie('cUserId')) && methods.getCookie('serviceToken')) {
            self.getTickets();
        }
        //写cookie的回调
        window.componetCallback = function () {
            self.getTickets();
        }
    }

    emit(id){
        this.props.getCoupon(id);
    }

    render() {
        var self = this;
        return (
            self.state.hasCoupon ?
            <div style={{paddingTop:'4px'}} className="text-right ins-orange coupon-tips">{parseInt(self.props.premium) >= self.state.couponLimit ? self.state.coupontips : ''}</div>
            : <i></i>
        );
    }
}