import React from 'react';
import methods from '../assets/methods.js';
import config from '../assets/config.js';
export default class TimerRange extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            range: [],
            period:this.props.period
        };
    }

    getRange(props) {
        var self = this;
        methods.Ajax({
            type: 'GET',
            url: config.api + 'productPeriods',
            params: {
                productId: localStorage.productId,
                data: JSON.stringify(props)
            },
            success: function (data) {
                if (data.success) {
                    self.setState({
                        range: data.periods
                    });
                    //处理一个两个
                    if(data.periods.length == 1){
                        self.chooseSumInsured(data.periods[0])
                    }else{
                        self.initRange(data.periods);
                    }
                } else {
                    console.log(data.code);
                    self.formTips("身份证号有误，请核实后重新输入。");
                }
            },
            error: function (status) {
                console.log(status)
            }
        })
    }

    initRange(range){
        var self = this;
        if(!self.state.period){
            self.chooseSumInsured(range[0])
        }else{
            var el = self.getElem(range,self.state.period);
            self.chooseSumInsured(el)
        }
    }

    getElem(arr,target){
        var hook = [];
        for(let i = 0;i < arr.length;i++){
            if(target == arr[i].sumInsured){
                hook = arr[i];
            }
        }
        return hook;
    }

    //切换选项
    chooseSumInsured(el) {
        var self = this;
        self.setState({
            period: el.period
        });
        self.props.setForms(el);
    }
    //提示调用
    formTips(msg){
        this.props.formTips(msg);
    }

    componentDidMount() {
        this.getRange(this.props);
    }

    render() {
        var classlist;
        var self = this;
        return (
            self.state.range.length > 1 ?
                <dl className="ins-range_common">
                    <dt>保障时间</dt>
                    <dd>
                        <div className="rangeinner">
                            {
                                self.state.range.map(function (el, index) {
                                    classlist = ['limit']
                                    if (!self.state.period && index == 0 || self.state.period == el.period) {
                                        classlist.push('active')
                                    } else {
                                        classlist.push('loan-border')
                                    }
                                    return (
                                        <span className={classlist.join(' ')} key={index}
                                              onClick={()=>self.chooseSumInsured(el)}>{el.period}年</span>
                                    )
                                })
                            }
                        </div>
                    </dd>
                </dl> : <hook title="保障时间不显示的占位符"></hook>
        )
    }
}