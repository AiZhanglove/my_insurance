import React from 'react';
import methods from '../assets/methods';
import NoContent from '../components/NoContent.jsx';
require('./HistoryList.css');

export default class HistoryList extends React.Component {
    constructor(props){
        super(props);
    }
    render () {
        var statusClass = 'logstatus-';
        var nocontent = '<div className="text-center">暂无数据</div>';
        return (
            <ul className="history-log">
                {
                    this.props.logs.length > 0 ? this.props.logs.map(function (el, index) {
                        var tagUrl = '?tintColor=15adae#/detail/' + el.id;
                        return (
                            <li key={index} className="log-list border">
                                <a title="保单详情" href={tagUrl}>
                                    <div className="left">
                                        <div className="log-info">
                                            <strong>{el.productName}</strong>
                                            <span className="gap">|</span>
                                            <span>{el.insured}</span>
                                        </div>
                                        <div className="log-time">
                                            {methods.date(el.beginTime)}
                                        </div>
                                    </div>
                                    <div className="right text-right">
                                        <span className={statusClass + el.payStatus.toLocaleLowerCase()}>
                                            {el.status == "FAIL" ? el.refundStatus ? methods.refundStatusFilter(el.refundStatus) : methods.payStatusFilter(el.payStatus) :methods.payStatusFilter(el.payStatus)}
                                        </span>
                                    </div>
                                </a>
                            </li>
                        )
                    }) : <NoContent/>
                }
            </ul>
        )
    }
}