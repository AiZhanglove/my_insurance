import React from 'react';
import methods from '../assets/methods';
import config from '../assets/config.js';
require('./MyAddress.less');
export default class MyAddress extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            "province":"1",
            "city":"72",
            "detail":"",
            "detailnum":false,
            "showTips":false,
            "saveStatus":true,
            "provinceLists":[],
            "cityLists":[],
            "currentCity":[]
        };
    }

    componentWillReceiveProps(nextProps){
        var self = this;
        self.getLocation(nextProps.init);
    }

    handleClick(data){
        var self = this;
        var address = self.getTarget(self.state.province,self.state.provinceLists)[0].name + self.getCityTarget(self.state.city,self.state.currentCity)[0].name + self.state.detail;
        var addressData = {
            provinceName:self.getTarget(self.state.province,self.state.provinceLists)[0].name,
            provinceCode:self.getTarget(self.state.province,self.state.provinceLists)[0].provinceId,
            cityName:self.getCityTarget(self.state.city,self.state.currentCity)[0].name,
            cityCode:self.getCityTarget(self.state.city,self.state.currentCity)[0].cityId,
            address:self.state.detail,
            allAddress:address,
            type:self.props.type
        };
        if(self.props.unsave){
            self.brodcast(addressData);
        }else{
            self.addAddress({
                provinceCode:self.getTarget(self.state.province,self.state.provinceLists)[0].provinceId,
                cityCode:self.getCityTarget(self.state.city,self.state.currentCity)[0].cityId,
                address:self.state.detail
            },addressData);
        }
    }

    getTarget(id,arr){
        var len = arr.length;
        var hook = [];
        for (var i = 0; i < len; i++) {
            if(arr[i].provinceId && arr[i].provinceId == id){
                hook.push(arr[i]);
            }
        }
        return hook;
    }

    getCityTarget(id,arr){
        var len = arr.length;
        var hook = [];
        if(id === ""){
            hook = [arr[0]];
        }else{
            for (var i = 0; i < len; i++) {
                if(arr[i].cityId && arr[i].cityId == id){
                    hook.push(arr[i]);
                }
            }
        }
        return hook;
    }

    checkAddress(e){
        this.setState({
            "detail":e.target.value
        });
        if(e.target.value.length >=8 && e.target.value.length <=80){
            this.setState({
                "detailnum":true,
                "showTips":false
            });
        }else{
            this.setState({
                "detailnum":false
            });
        }
    }

    addressBlur(e){
        if(e.target.value.length <8 || e.target.value.length >80){
            this.setState({
                "detailnum":false,
                "showTips":true
            });
        }else{
            this.setState({
                "detailnum":true,
                "showTips":false
            });
        }
    }

    //选择省
    chooseProvince(e){
        var curcity = this.getTarget(e.target.value,this.state.cityLists);
        this.setState({
            "province":e.target.value,
            "currentCity":curcity
        });
        //fixed 不选择市区时候没有选中的问题
        this.chooseCity({
            "target":{"value":curcity[0].cityId}
        })
    }
    //选择市区
    chooseCity(e){
        this.setState({
            "city":e.target.value
        });
    }

    closeclick(){
        this.props.onClick(false);
    }
    //向外广播选中数据
    brodcast(res){
        this.props.onClick(res);
    }

    addAddress(json,parentJson){
        var self = this;
        methods.Ajax({
            type: 'POST',
            url: config.api + 'userAddress',
            params:json,
            success: function (data) {
                if(data.success){
                    self.brodcast(parentJson);
                    self.setState({
                        "saveStatus":true
                    })
                }else{
                    self.setState({
                        "saveStatus":false
                    })
                }
            },
            error: function (status) {
                self.setState({
                    "saveStatus":false
                })
                console.log(status);
            }
        })
    }

    commonSet(data,status){
        var self = this;
        var provinceList = data.provinceList;
        var cityList = data.cityList;
        //其中省市是有地址的时候取值回来默认值
        self.setState({
            provinceLists:provinceList,
            cityLists:cityList,
            currentCity:self.getTarget((status.provinceCode || 1),cityList),
            province:status.provinceCode || "1",
            city:status.cityCode || "72",
            detail:status.address || ""
        });
        //初始化调用检查address
        setTimeout(function () {
            if(status && status.provinceCode){
                self.addressBlur({
                    "target":{
                        "value":status.address || ""
                    }
                })
            }
        },100)
    }

    getLocation(status){
        var self = this;
        //缓存地址信息
        if(localStorage.insaddress){
            var data = JSON.parse(localStorage.insaddress);
            self.commonSet(data,status);
        }else{
            methods.Ajax({
                type: 'GET',
                url: config.api + 'provinceAndCityList',
                success: function (data) {
                    localStorage.insaddress = JSON.stringify(data);
                    self.commonSet(data,status);
                },
                error: function (status) {
                    console.log(status);
                }
            })
        }
    }

    componentDidMount() {
        var self = this;
        self.getLocation(self.props.init);
        //写cookie的回调
        window.componetCallback = function () {
            self.getLocation(self.props.init);
        }
    }

    render() {
        var self = this;
        var okbtn = '';
        if(self.state.province && self.state.city && self.state.detailnum){
            okbtn =  <span className="add-col-5 addright ablue"><a onClick={() => this.handleClick()}>确定</a></span>;
        }else{
            okbtn =  <span className="add-col-5 addright ablue disabled"><a>确定</a></span>;
        }
        return (
            <div className={ this.props.show == "true" ? "address-container showaddress" : "address-container"}>
                <div className="address-box">
                    <div className="addform">
                         <div className="add-control clear">
                            <span className="add-col-5 addleft loan-border">
                                <select onChange={(e) => this.chooseProvince(e)} value={self.state.province ? self.state.province : '1'}>
                                    {
                                        this.state.provinceLists.map(function (el,index) {
                                            return (<option key={index} value={el.provinceId}>{el.displayName}</option>)
                                        })
                                    }
                                </select>
                            </span>
                            <span className="add-col-5 addright loan-border">
                                <select onChange={(e) => this.chooseCity(e)} value={self.state.city ? self.state.city : '1'}>
                                    {
                                        this.state.currentCity.map(function (el,index) {
                                            return (<option key={index} value={el.cityId}>{el.name}</option>)
                                        })
                                    }
                                </select>
                            </span>
                         </div>
                        <div className="add-control loan-border">
                            <input type="text" name="" onBlur={(e) => this.addressBlur(e)} onChange={(e) => this.checkAddress(e)} value={this.state.detail} placeholder="请输入详细地址" className="address-input"/>
                        </div>
                        <div className="ins-orange">{self.state.showTips ? "地址长度必须是8~80个字" : ""}</div>
                    </div>
                    <div className="addfn clear">
                        <div className="ins-orange text-center saveerror">
                            {!self.state.saveStatus ? "地址保存失败请重试!" : ""}
                        </div>
                        <span className="add-col-5 addleft loan-border">
                            <a onClick={() => this.closeclick()}>取消</a>
                        </span>
                        {okbtn}
                    </div>
                </div>
            </div>
        )
    }
}