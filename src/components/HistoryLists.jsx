import React from 'react';
import methods from '../assets/methods';
import NoContent from '../components/NoContent.jsx';
import Tab from '../components/NewTab.jsx';
require('./HistoryList.css');

export default class HistoryList extends React.Component {
    constructor(props){
        super(props);
    }

    changeData(role){
        this.props.changeData(role)
    }

    render () {
        var statusClass = 'logstatus logstatus-';
        var nocontent = '<div className="text-center">暂无数据</div>';
        return (
            <div>
                <Tab tabs={this.props.tabs} onChange={(role) => this.changeData(role)} />
                <ul className="history-log tab-top">
                    {
                        this.props.logs && this.props.logs.length > 0 ? this.props.logs.map(function (el, index) {
                            var tag = el.orderDetailUrl ? el.orderDetailUrl : 'detail';
                            var tagUrl = '?tintColor=15adae#/'+tag+'/' + el.id;
                            var tagUrl1 = '?productId='+el.productId+'#/'+tag+'/' + el.id;
                            return (
                                <li key={index} className="log-list log-link btm-bl">
                                    {
                                        el.orderDetailUrl != 'cardetail' && el.orderDetailUrl != 'newcardetail' ? <a title="保单详情" href={tagUrl}>
                                            <div className="left">
                                                <div className="log-info">
                                                    <strong>{el.productName}</strong>
                                                </div>
                                                <div className="log-time">
                                                    {methods.date(el.beginTime)}至{methods.date(el.endTime-10000)}
                                                </div>
                                            </div>
                                            <div className="right text-right">
                                            <span className={statusClass + el.status.toLocaleLowerCase()}>
                                                <b className={"logstatus-" + el.canPay}>{ el.canPay ? "待支付" : methods.statusFilter(el.status)  }</b>
                                            </span>
                                            </div>
                                        </a> : <a title="保单详情" href={tagUrl1}>
                                            <div className="left">
                                                <div className="log-info">
                                                    <strong>{el.productName}</strong>
                                                    <span className="gap">|</span>
                                                    <span>{el.vehicleLicencePlateNo}</span>
                                                </div>
                                                <div className="log-time">
                                                    {methods.date(el.businessEffectiveDate)+'至'+methods.date(el.businessExpireDate)+'(商业险)'}
                                                </div>
                                                <div className="log-time">
                                                    {
                                                        el.compelEffectiveDate == '0' ? '' : methods.date(el.compelEffectiveDate)+'至'+methods.date(el.compelExpireDate) + '(交强险)'
                                                    }
                                                </div>
                                            </div>
                                            <div className="right text-right">
                                            <span className={el.status == 'CHECKED' ? statusClass + el.status.toLocaleLowerCase() + ' car-checked' : statusClass + el.status.toLocaleLowerCase()}>
                                                {el.status == 'CHECKED' ? '待支付' : (el.status == 'ISSUED' ? '待起保' : methods.statusFilter(el.status))}
                                            </span>
                                            </div>
                                        </a>
                                    }
                                </li>
                            )
                        }) : this.props.logs ? <NoContent/> : ""
                    }
                </ul>
            </div>

        )
    }
}