import React from 'react';
import methods from '../assets/methods.js';
require("./ActivityBar.less");
export default class ActivityBar extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            configs:''
        };
    }

    getConfig() {
        var self = this;
        methods.Ajax({
            type: 'GET',
            url: '/v1/insurance/getProductDetailActivityInfo',
            params:{
                productId:self.props.id
            },
            success: function (res) {
                if(res.success){
                    self.setState({
                        configs:res.data
                    })
                }
            }
        })
    }

    linkTo(){
        var self = this;
        //统计方法
        MiFiLoantracker({
            pageTitle: 'ins_detail_ac_' + self.props.id,
            productType:"insurance"
        });
        //跳转
        methods.startActivity(self.state.configs.activityUrl,"");
    }

    componentDidMount() {
        this.getConfig();
    }

    render() {
        return (
            this.state.configs ?
            <div className="activity-show" onClick={() => {this.linkTo()}} href={this.state.configs.activityUrl}><span className="activity-show-inner">{this.state.configs.activityTip}</span></div>
                : <void></void>
        );
    }
}