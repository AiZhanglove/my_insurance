import React from 'react';
import methods from '../assets/methods.js';
import config from '../assets/config.js';
export default class RangeComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        /*一下参数影响此组件 也即是props的参数
        * nationalIdNum: self.state.nationalIdNum,
         birthday: self.state.birthday,
         gender:self.state.gender,
         period:self.state.period
        * */
        // 初始状态
        this.state = {
            range: [],
            sumInsured:this.props.sumInsured
        };
    }

    componentWillReceiveProps(nextProps){ //此处用作为监控参数的变化来调起getRange 从而达到不用手动调用
        var self = this;
        if(self.props.nationalIdNum != nextProps.nationalIdNum || self.props.birthday != nextProps.birthday || self.props.gender != nextProps.gender || self.props.period != nextProps.period){
            self.getRange(nextProps);
        }
    }

    getRange(props) {
        var self = this;
        methods.Ajax({
            type: 'GET',
            url: config.api + 'sumInsuredPremiums',
            params: {
                productId: localStorage.productId,
                data: JSON.stringify(props)
            },
            success: function (data) {
                if (data.success) {
                    self.setState({
                        range: data.sumInsuredPremiums
                    });
                    //如果只有一个范围则不需要显示来选择可以直接返回数据
                    if(data.sumInsuredPremiums.length == 1){
                        self.chooseSumInsured(data.sumInsuredPremiums[0])
                    }else{
                        self.initRange(data.sumInsuredPremiums);
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
        if(!self.state.sumInsured){
            self.chooseSumInsured(range[0])
        }else{
            var el = self.getElem(range,self.state.sumInsured);
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
            sumInsured: el.sumInsured
        });
        self.props.setForms({
            sumInsured: el.sumInsured,
            premium: el.premium
        });
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
                <dt>保障额度</dt>
                <dd>
                    <div className="rangeinner">
                        {
                            self.state.range.map(function (el, index) {
                                classlist = ['limit']
                                if (!self.state.sumInsured && index == 0 || self.state.sumInsured == el.sumInsured) {
                                    classlist.push('active')
                                } else {
                                    classlist.push('loan-border')
                                }
                                return (
                                    <span className={classlist.join(' ')} key={index}
                                          onClick={()=>self.chooseSumInsured(el)}>{methods.fen2Wan(el.sumInsured, 0)}万</span>
                                )
                            })
                        }
                    </div>
                </dd>
            </dl> : <hook title="保障额度不显示的占位符"></hook>
        )
    }
}