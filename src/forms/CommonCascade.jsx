import React from 'react';
import methods from '../assets/methods';
require("../forms/cascade.less");
export default class CommonCascade extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            lists:'',  //渲染列表使用
            params:[], //提交给后台数据使用
            txt:''     //展示在用户看到所用
        }
    }
    //远程获得数据 action 为了判断是不是人为点击的
    getRes(json){
        var self = this;
        if(json.id == 0){
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
                type:json.type,
                parentId:json.id
            },
            success: function (res) {
                if(typeof(res) == "string"){
                    res = JSON.parse(res);
                }
                if(res.success){
                    // 设置值
                    if(res.extraParams.length > 0){
                        self.setState({
                            lists:res.extraParams
                        })
                    }else{ //如果数组长度为0 说明结束了
                        if(json.action){
                            self.emit(json.id);  //传递选择数据
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
            self.getRes({
                id:el.id,
                action:true,
                type:self.props.show.ajaxType
            });
        })
    }

    componentWillReceiveProps(newProps) {
        var self = this;
        if(newProps.show.ajaxType && newProps.show.ajaxType != self.props.show.ajaxType){ //判断如果ajaxType变化重新请求接口
            self.getRes({
                id:0,
                action:false,
                type:newProps.show.ajaxType
            })
        }
    }

    componentDidMount() {
        var self = this;
        //初始化
        if(self.props.show && self.props.show.ajaxType){
            self.getRes({
                id:0,
                action:false,
                type:self.props.show.ajaxType
            });
        }
    }
    //向外传播数据
    emit(val){
        var self = this;
        var json = {
            txt:self.state.txt
        }
        if(self.props.show.ajaxType == "JOB"){ //职业
            json.txt = json.txt.split(" ").reverse()[0];
        }
        json[self.props.show.name] = val;
        this.props.emitFn(json,self.props.show.index);
    }

    setOuter(bol){
        if(bol){
            document.documentElement.style.height = "100vh";
            document.body.style.height = "100vh";
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";

        }else{
            document.documentElement.style.height = "auto";
            document.body.style.height = "auto";
            document.documentElement.style.overflow = "auto";
            document.body.style.overflow = "auto";
        }
    }

    render(){
        var self = this;
        self.setOuter(self.props.show);
        return (
            <div id="cascade-choose" className={self.props.show ? "showModal" : ""}>
                <div id="cascade-inner">
                    <h4 className="btm-bl">请选择</h4>
                    <span id="cascade-close" onClick={() => self.hideModal()}></span>
                    <ul id="cascade-list">
                        {
                            self.state.lists ? self.state.lists.map(function (el, index) {
                                return(
                                    <li key={index} className="btm-bl" onClick={() => self.chooseOption(el,index)}>{el.displayName}</li>
                                )
                            }) : '加载中...'
                        }
                    </ul>
                </div>
            </div>
        )
    }
}