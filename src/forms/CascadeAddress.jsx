import React from 'react';
import methods from '../assets/methods';
require("../forms/cascade.less");
export default class CascadeAddress extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            lists:'',  //渲染列表使用
            params:[], //提交给后台数据使用
            txt:''     //展示在用户看到所用
        }
    }
    //远程获得数据
    getRes(id,action){
        var self = this;
        if(id == 0){
            self.setState({
                txt:'',
                lists:[]
            })
        }else{
            self.setState({
                lists:[]
            })
        }
        methods.Ajax({
            type: 'GET',
            url: "/v1/insurance/product/listExtraParams",
            params: {
                productId:self.props.id,
                type:"CITY",
                parentId:id
            },
            success: function (res) {
                if(res.success){
                    // 设置值
                    if(res.extraParams.length > 0){
                        self.setState({
                            lists:res.extraParams
                        })
                    }else{ //如果数组长度为0 说明结束了
                        if(action){
                            self.emit(id);  //传递选择数据
                            self.hideModal(); //关闭弹出层
                        }
                    }
                }
            },
            error: function (status) {
                console.log(status)
            }
        })
    }
    //关闭保费测试弹出层
    hideModal(){
        this.props.hidePop();
    }
    //选择选项
    chooseOption(el,index){
        var self = this;
        var oldTxt = self.state.txt;
        self.setState({
            txt:oldTxt + " " + el.displayName
        }, function () {
            self.getRes(el.id,true);
        })
    }

    componentWillReceiveProps(newProps) {
        var self = this;
        if(newProps.show){
            self.getRes(0);
        }
    }

    componentDidMount() {
        var self = this;
        //初始化
        self.getRes(0);
    }
    //向外传播数据
    emit(val){
        var self = this;
        var json = {
            txt:self.state.txt
        }
        console.log(self.props.show);
        json[self.props.show.name] = val;
        self.props.setForms(json,self.props.show.index);
    }

    render(){
        var self = this;
        return (
            <div id="cascade-choose" className={self.props.show ? "showModal" : ""}>
                <div id="cascade-inner">
                    <h4 className="btm-bl">请选择</h4>
                    <span id="cascade-close" onClick={() => self.hideModal()}></span>
                    <ul id="cascade-list">
                        {
                            self.state.lists && self.state.lists.map(function (el, index) {
                                return(
                                    <li key={index} className="btm-bl" onClick={() => self.chooseOption(el,index)}>{el.displayName}</li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}