import React from 'react';
import methods from '../assets/methods';

export default class SafeGuardComponent extends React.Component {
	// 构造
    constructor(props) {
        super(props);
        this.state = {
            safes:''
        }
    }
    componentDidMount() {
        var self = this;
        if(self.props.show){
            self.getSafes();
        }
    }
    getSafes(){
        var self = this;
        methods.Ajax({
            type:'GET',
            url:'/v1/insurance/product/productSafeGuard',
            params:{
                productId:self.props.id
            },
            success:function(res){
                if(res.success){
                    self.setState({
                        safes:res.safeguard && res.safeguard.safeGuardsSize > 0 ? res.safeguard : ''
                    })
                }
            }
        })
    }

    safeHandleClick (el){
        this.filterList(this.state.safes.safeGuards);
        el.open = 1;
        this.setState({
            safes:this.state.safes
        })
    }
    filterList(arr){
        arr.forEach(function (el) {
            el.open = 0;
        })
    }

        //第一个index表示大的数字的索引,indx表示内部数字的索引
    accordion(el,index,indx){
        var self = this;
        var old = self.state.safes;
        old.safeGuards[index].details[indx].open = !old.safeGuards[index].details[indx].open;
        self.setState({
            safes:old
        })
    }
    render(){
    	var self = this;
    	return(
    		self.state.safes ?
                <div className="safe-container ins-border">
                    <h2 className="btm-bl">{self.state.safes.title}</h2>
                    <div className="safe-amounts-box btm-bl">
                        <label>保额</label>
                        <div className="amounts-box">
                            {
                                self.state.safes.safeGuards.map(function (el, index) {
                                    var tabclass = "safe-amount";
                                    if(el.open){
                                        tabclass = "safe-amount active";
                                    }
                                    return (
                                        <span key={index} className={tabclass} onClick={function(e) {self.safeHandleClick(el)}}>{el.sum}</span>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {
                        self.state.safes.safeGuards.map(function (el, index) {
                            return (
                                <div key={index} className="safe-detail-info btm-bl" style={el.open ? {} : {display:"none"}}>
                                    {
                                        el.details.map(function (ele, indx) {
                                            var innerClass = "btm-bl safe-detail-single";
                                            if(ele.open){
                                                innerClass = "btm-bl safe-detail-single active";
                                            }
                                            return (
                                                <div key={indx} className={innerClass} onClick={() => {self.accordion(ele,index,indx)}}>
                                                    <b>{ele.amount}</b>
                                                    <h4>{ele.title}</h4>
                                                    <p>{ele.detail}</p>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div> : <hook></hook>
    	)
    }

}