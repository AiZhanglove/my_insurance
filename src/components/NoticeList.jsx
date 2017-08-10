import React from 'react';
import methods from '../assets/methods';
import NoContent from '../components/NoContent.jsx';
import Button1 from '../components/Button1.jsx';
import Tab from '../components/NewTab.jsx';
export default class HistoryList extends React.Component {
    constructor(props){
        super(props);
    }

    changeData(role){
        this.props.changeData(role)
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

    gotoBuy(){
        var myfrom = methods.getParam("from") || "";
        var url = methods.baseUrl + "/insurance/insurance.html?source=p0&from="+myfrom+"#/weatherbuy/15";
        if(window.MiFiJsInternal && !MiFiJsInternal.mock){ //客户端
            MiFiJsInternal.finishCurrentActivity();
        }else{
            methods.startActivity(url, "天气险")
        }
    }

    render () {
        var self = this;
        var statusClass = 'logstatus logstatus-';
        var nocontent = '<div className="text-center">暂无数据</div>';
        return (
            <div>
                <Tab tabs={this.props.tabs} onChange={(role) => this.changeData(role)} />
                <div className="weather-noticelist">
                    {
                        self.props.logs.length > 0 ? self.props.logs.map(function (el,index){
                            return (
                                <dl className="border" key={index}>
                                    <dt>{methods.date(el.date)}</dt>
                                    <dd>
                                        {
                                            el.actualWeathers.map(function (ele, indx) {
                                               return (
                                                   <span className={ ele.claimCount > 0 ?  "notice-single notice-" + ele.type.toLocaleLowerCase() : "notice-single"} key={indx}>
                                                       <h4>{ele.value} <sup>{self.weatherAllFilter(ele).unit}</sup></h4>
                                                       <p>{ele.claimCount}人获赔</p>
                                                   </span>
                                               )
                                            })
                                        }
                                    </dd>
                                </dl>
                            )
                        }) : <NoContent/>
                    }
                </div>
                <div className="notice-ps">
                    数据以中国气象局为准
                </div>
                <Button1 class="white loan-border" onClick={() => this.gotoBuy()} value="立即投保"/>
            </div>

        )
    }
}