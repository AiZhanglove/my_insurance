import React from 'react';
import methods from '../assets/methods';
import config from '../assets/config.js';
require('./MyCity.css');
export default class MyAddress extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            usefulCitys:[],
            citys:{},
            firstLetters:[]
        };
    }

    // componentWillReceiveProps(nextProps){
    //     var self = this;
    //     self.getLocation(nextProps.init);
    // }

    // getLocation(status){
    //     var self = this;
    //     //缓存地址信息
    //     if(localStorage.insaddress){
    //         var data = JSON.parse(localStorage.insaddress);
    //         self.commonSet(data,status);
    //     }else{
    //         methods.Ajax({
    //             type: 'GET',
    //             //shoudLogin: true,
    //             url: config.api + 'provinceAndCityList',
    //             success: function (data) {
    //                 localStorage.insaddress = JSON.stringify(data);
    //                 self.commonSet(data,status);
    //             },
    //             error: function (status) {
    //                 console.log(status);
    //             }
    //         })
    //     }
    // }

    selectCity(e, abbr) {
        e = e.target;
        this.props.onClick(e.innerHTML.substring(0, e.innerHTML.length - 1), abbr);
    }

    clearIptValue(e) {
        this.refs.val.value = "";
    }

    componentWillMount() {
        document.title = "车辆归属城市";
    }

    componentDidMount() {
        var self = this;
        methods.Ajax({
            type:"GET",
            url:'/v1/insurance/usefulCity',
            success:function(data) {
                if (data.success) {
                    self.setState({
                        usefulCitys:data.usefulcitys,
                        citys:data.citys
                    })
                }
            },
            error:function(status) {
                console.log(status);
            }

        });

        console.log(document.getElementById('show-cont'));


        document.getElementById('show-cont').addEventListener('touchmove', function(e) {
            console.log(2222)
            // e.preventDefault();
            e.stopPropagation();
        }, false)
    }

    render() {
        var self = this;
        var a = <div className=""></div>;
        var b = <span className=""></span>;
        var c = <img className="" src="" />
        var conts = [];
        var citys = self.state.citys;
        var letters = [];
        if (citys) {
            for(var cy in citys){
                letters.push(cy);
            }
            console.log(citys)
        }
        if (letters.length && citys) {
            for (var i = 0; i < letters.length; i++) {
                if (citys[letters[i]].length) {
                    conts.push(letters[i]);
                }
            }
        }
        

        return (
            <div id="show-cont" className={this.props.show == "true" ? "citys-container showCitys" : "citys-container"} ref="citysContainer">
                <div className="mod-search border">
                    <div className="search-wrap loan-border">
                        <img className="search left" src="/images/insurance/search.png" />
                        <span className="ipt">
                            <input type="text" placeholder="搜索城市" ref="val"/>
                        </span>
                        <img className="search right" src="/images/insurance/delete.png" onClick={(e) => this.clearIptValue(e)} />
                    </div>
                </div>
                <div className="mod-useful border">
                    <div className="useful_wrap">
                        {
                            self.state.usefulCitys.length ? self.state.usefulCitys.map(function(el ,index) {
                                return (
                                    <span key={index} className="useful_city loan-border" onClick={(e) => self.selectCity(e, el.abbreviation)}>{el.city}</span>
                                )
                            }) : ""
                        }
                    </div> 
                </div>
                <div className="mod-citys">
                    {
                        letters.length && citys ? letters.map(function(el, index) {  //el = ABCD, index = 0123456
                            if (citys[el].length) { //判断数组是否为空
                                return(
                                    <div key={index} className="">
                                        <div name={el}  className="letter bold border">{el}</div>
                                        {
                                            citys[el].map(function(newEl, newIndex) {  //newEl == [],[{"city":"北京市","abbreviation":"京"}]  newIndex= 0,1,5,3,4...
                                                var abbr = citys[el][newIndex].abbreviation;
                                                return (
                                                    <div key={(newIndex + 26) * (index + 1)}  className="city border" onClick={(e) => self.selectCity(e, abbr)} refs={citys[el][newIndex].city} >{citys[el][newIndex].city}</div>
                                                )
                                            })
                                        }
                                    </div>
                                    
                                )
                            }
                             
                        }) :""
                    }
                </div>
                <div className="first_letter">
                    {
                        conts.length ? conts.map(function(el, index) {
                            return (
                                <div key={index} className="select_letter bold" onClick={(e) => self.turn(e)}>{el}</div>
                            )
                        }) : ''
                    }
                </div>
            </div>
        )
    }
}