import React from 'react';
import methods from '../assets/methods';
export default class BankListComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            lists:'',
            defaultOption:null
        }
    }

    geRes(pid){
        var self = this;
        methods.Ajax({
            type: 'GET',
            url: '/v1/insurance/product/listExtraParams',
            params:{
                productId:self.props.id,
                type:"BANK",
                parentId:pid
            },
            success: function (res) {
                if(res.success){
                    if(res.extraParams.length>0){
                        self.setState({
                            lists:res.extraParams
                        }, function () {
                            //如果是没有初始值则赋值第一个
                            if(!self.state.defaultOption){
                                var json = {}
                                json[self.props.name] = res.extraParams[0].id;
                                self.props.setForms(json);
                            }
                        })
                    }
                }
            },
            error: function (status) {
                console.log(status);
            }
        })
    }

    //获取相关的数据为提交使用
    getRelat(e,index){
        var self = this;
        var newVal = e.target.value;
        var json = {};
        json[self.props.name] = newVal;
        self.props.setForms(json);
    }

    componentDidMount() {
        var self = this;
        //初始化数据
        self.geRes(0);
    }

    render(){
        var self = this;
        return (
            <li className="btm-bl right-arrow">
                <label className="form-key">{this.props.displayName ? this.props.displayName : "开户行"}</label>
                <div className="form-inputbox">
                    {
                        self.state.lists &&  <select value={self.state.defaultOption} onChange={(e) => self.getRelat(e)}>
                            {
                                self.state.lists.map(function (ele,indx) {
                                    return (
                                        <option key={indx} value={ele.id}>{ele.displayName}</option>
                                    )
                                })
                            }
                        </select>
                    }
                </div>
            </li>
        )
    }
}