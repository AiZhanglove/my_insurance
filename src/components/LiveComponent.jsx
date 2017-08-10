import React from 'react';
import methods from '../assets/methods.js';
export default class LiveComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            lives:[]
        }
    }

    weatherAllFilter(el){
        var json = {};
        if(!el) return;
        switch (el.type){
            case "HOT":
                json.type = '高温';
                json.unit = "°";
                break;
            case "COLD":
                json.type = '低温';
                json.unit = "°";
                break;
            case "RAIN":
                json.type = '大雨';
                json.unit = "mm";
                break;
            case "AIR":
                json.type = '空气';
                json.unit = "AQI";
                break;
            case "WIND":
                json.type = '大风';
                json.unit = "级";
                break;
            default:
                json.type = '未知';
                json.unit = "x";
                break;
        }
        return json;
    }

    autoLives(){
        var self = this;
        var len = self.state.lives.length -1;
        if(!len) return;
        var i = -1;
        var auto = function () {
            i++;
            self.clearState(i);
            if(i == len){
                i = -1;
            }
            window.timer = setTimeout(auto,1000 * 4);
        };
        auto();
    }

    clearState(i){
        var arr = this.state.lives;
        arr.map(function (el,index) {
            el.value = false;
        });
        arr[i].value = true;
        this.setState({
            lives:arr
        });
    }

    //获取理赔信息
    getLives(){
        var self = this;
        methods.Ajax({
            type:"GET",
            url:"/v1/insurance/weatherInsHitScrollBar",
            success:function(data){
                if(data.success){
                    self.setState({
                        lives:self.manageData(data.weatherInsHitDetails)
                    })
                    setTimeout(function () {
                        self.autoLives();
                    },300)
                }
            },
            error:function(status){
                console.log(status);
            }
        })
    }

    manageData(arr){
        var self = this;
        arr.map(function(el,index){
            if(index == 0){
                el.value = true;
            }else{
                el.value = false;
            }
            el.txt = methods.date(parseInt(el.insDate)) + "，用户" + el.userName + "获赔" + methods.fen2Yuan(el.claimAmount) + "元"
        })
        return arr;
    }

    componentWillUnMount() {
        clearTimeout(window.timer);
    }

    componentDidMount() {
        this.getLives();
    }

    render() {
        var self = this;
        return (
            <dl className="livebox">
                <dt><a href="./insurance_asset.html#/notice" title="理赔公告">理赔实况</a></dt>
                <dd className="live-container" id="liveJs">
                    {
                        self.state.lives.map(function (el, index) {
                            var classes = "";
                            if(el.value){
                                classes = "active";
                            }else{
                                classes = "";
                            }
                            return (
                                <p className={classes} key={index}>{el.txt}</p>
                            )
                        })
                    }
                </dd>
            </dl>
        );
    }
}


