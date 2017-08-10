import React from 'react';
import methods from '../assets/methods.js';
import config from  '../assets/config.js';
import DatepickerComponent from '../frame/DatepickerComponent.jsx';

require("./Measure.less");
export default class Measure extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showModal:false,
            configs:'',
            params:{},
            premium:0
        };
    }
    cancel(){
        this.setState({
            showModal:false
        })
    }

    getConfigs(){
        var self = this;
        methods.Ajax({
            type:'GET',
            url:'/v1/insurance/testdatas',
            params:{
                productId:localStorage.productId
            },
            success:function(res){
                if(res.success){
                    self.setState({
                        configs:res.data,
                        params:res.data.testParams
                    }, function () {
                        self.calcPremium(self.state.params);
                    })
                }
            }
        })
    }

    changeFn(e,el){
        var self = this;
        var json = self.state.params;
        json[el.parameter] = e.target.value;
        self.setState({
            params:json
        },function(){
            console.log(json);
            self.calcPremium(self.state.params);
        });
    }

    componentDidMount() {
        var self = this;
        self.getConfigs();
    }

    //计算保费
    calcPremium(data){
        console.log(data);
        var self = this;
        methods.Ajax({
            type:'GET',
            url:'/v1/insurance/calcpremium',
            params:data,
            success:function(data){
                if(data.success){
                    console.log(data);
                }
            }
        })
    }

    emit(){
        this.props.closeModal();
    }

    hideModal(){
        this.emit();
    }

    stopScroll(e){
        e.preventDefault();
        e.stopPropagation();
    }

    commFrom(data,index){
        var self = this;
        var json = self.state.params;
        var lists = self.state.configs;
        lists.configList[index]["default"] = data.value;
        json[data.key] = data.value;
        self.setState({
            configs:lists,
            params:json
        }, function () {
            self.calcPremium(self.state.params);
        });
    }

    render() {
        var self = this;
        return (
            <div onTouchMove={(e) => self.stopScroll(e)} className={self.props.show ? "measure-container showModal" : "measure-container"}>
                <div className="measure-mask" onClick={() => self.hideModal()}></div>
                <div className="measure-inner" >
                    <div className="measure-head border">
                        保费: <span className="ins-orange">{methods.fen2Yuan(self.state.premium,2)}元</span>
                        <span className="close-measure" onClick={() => self.hideModal()}>&times;</span>
                    </div>
                    <ul className="ins-form_common noborder">
                        {
                            self.state.configs ? self.state.configs.configList.map(function (el, index) {
                                return (
                                    <li key={index} className="border right-arrow">
                                        <label className="form-key">{el.name}</label>
                                        <div className="form-inputbox">
                                            {
                                                el.role == "array" ?
                                                    <select defaultValue={el.default} onChange={(e) => self.changeFn(e,el)}>
                                                        {
                                                            el.value.map(function (ele,ind) {
                                                                return (<option key={ind} value={ele.value}>{ele.name}</option>)
                                                            })
                                                        }
                                                    </select>
                                                    : el.role == "birthday"
                                                    ?
                                                    <DatepickerComponent min="16" max="36" init="26" value={el.default} parameter={el.parameter} setForms={(data) => self.commFrom(data,index)} />
                                                    : "其他"
                                            }
                                        </div>
                                    </li>
                                )
                            })
                                : ''
                        }
                    </ul>
                </div>
            </div>
        );
    }
}