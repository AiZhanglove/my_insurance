import React from 'react';
import methods from '../assets/methods';
import Tab from '../components/NewTab.jsx';
require('./HistoryList.css');

export default class WeatherHistoryList extends React.Component {
    constructor(props){
        super(props);
    }

    changeData(role){
        this.props.changeData(role)
        window.role = role;
    }

    componentDidMount() {
        window.role = "PUBLISH";
    }

    render () {
        var statusClass = 'logstatus logstatus-';
        return (
            <div>
                <Tab tabs={this.props.tabs} onChange={(role) => this.changeData(role)} />
                <ul className="history-log tab-top">
                    {
                        this.props.logs.length > 0 ? this.props.logs.map(function (el, index) {
                            var tagUrl = '#/watherdetail/' + el.orderExtraId + "_" + el.date;
                            return (
                                <li key={index} className="log-list log-link border">
                                    <a title="保单详情" href={tagUrl}>
                                        <div className="left">
                                            <div className="log-info">
                                                <strong>{el.cityName}</strong>
                                            </div>
                                            <div className="log-time">
                                                {methods.date(el.date)}
                                            </div>
                                        </div>
                                        <div className="middle">
                                            {window.role == "HIT" ?
                                                el.claimStatus && el.claimStatus == "RECEIVE" ? "已领取" :
                                                    el.claimStatus && el.claimStatus == "SEND" ? "未领取" : "" : ""}
                                        </div>
                                        <div className="right text-right">
                                        <span className={statusClass + el.status.toLocaleLowerCase()}>
                                            {
                                                window.role == "PUBLISH"  ? methods.date(parseInt(el.publishTime)) + "公布" :
                                                window.role == "HIT" ? methods.fen2Yuan(el.claimAmount,2) + "元" :
                                                window.role == "MISS" ? el.status == "MISS" ? "未获赔" : "未成功" : ""
                                            }
                                        </span>
                                        </div>
                                    </a>
                                </li>
                            )
                        }) : <div style={{position:"fixed",top: "60%",left:"0px",width:"100%",textAlign:"center"}}>暂无数据</div>
                    }
                </ul>
            </div>

        )
    }
}