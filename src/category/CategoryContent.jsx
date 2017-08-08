import React from 'react';
import methods from '../assets/methods';
import CategoryList from './CategoryList.jsx';
import Loading from '../components/Loading.jsx';
window.lock = false;
export default class CategoryContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lists: [],
            isLoading: true,
            lock:false,
            step:7,
            total:6,
            partnerId:props.params.id || 120
        }
    }

    getList(pageNum){
        var self = this;
        var hosts = window.location.protocol + "//" + window.location.host;
        var platform = methods.getPlatform() || "web";
        //加载显示loading
        var oFlag = document.getElementById("flag");
        if(pageNum && pageNum > 1){
            oFlag.className = "indexloading";
        }
        window.lock = true;
        self.setState({
            //lock:true,
            isLoading: pageNum && pageNum == 1 ? true : false
        });
        methods.Ajax({
            type: 'GET',
            url: hosts + '/v1/insurance/productsV2',
            params: {
                "partnerId": self.state.partnerId,
                "pageNum": pageNum || 1,
                "platform": platform,
                "pageSize": self.state.step
            },
            success: function (data) {
                if (data.success) {
                    if (parseInt(data.pageNum) == 1 && parseInt(data.totalCount) > parseInt(data.pageSize)){
                        self.lazy();
                    }
                    var originList = self.state.lists || [];
                    oFlag.className = "";
                    var lockHook = false;
                    if(self.state.lists.length + parseInt(data.pageSize) >= parseInt(data.totalCount)){
                        lockHook = true;
                    }
                    self.setState({
                        lists: originList.concat(data.products),
                        total:parseInt(data.totalCount),
                        //lock:lockHook,
                        isLoading: false
                    }, function () {
                        window.lock = lockHook;
                    })
                }
            },
            error: function (status) {
                console.log(status)
            }
        });
    }

    lazy(){
        var self = this;
        var initH = self.refs.anchor.getBoundingClientRect().top;
        var winH = window.innerHeight;
        var count = 1;
        window.removeEventListener('scroll', scrollFn,false);
        window.addEventListener('scroll', scrollFn,false);
        function scrollFn(){
            winH = window.innerHeight + 120;
            initH = self.refs.anchor.getBoundingClientRect().top;
            //
            if(winH >= initH && !window.lock){
                if(count * self.state.step < self.state.total){
                    count++;
                    self.getList(count);
                }else{
                    window.removeEventListener('scroll', scrollFn,false);
                }
            }
        }
    }

    componentWillReceiveProps(newProps) {
        var self = this;
        if(newProps.params.id !== self.props.params.id){ //需要切换
            self.changeTab(newProps.params.id);
        }
    }

    changeTab(id){
        var self = this;
        self.setState({
            partnerId:id,
            lists: []
        }, function () {
            self.getList(1);
        })
    }

    componentDidMount() {
        var self = this;
        self.getList(1);
        //禁掉back
        window.MiFiJsInternal && MiFiJsInternal.disableGoBack(true)
        //轻度刷新
        window.onReload = function () {
            //nothing to do
        }
        //统计
        MiFiLoantracker({
            pageTitle: 'ins_category_' + self.props.params.id,
            productType: "insurance"
        });
    }

    render() {
        return (
            <div className="category-padding btm-bl">
                <CategoryList status={this.state.isLoading} lists={this.state.lists}/>
                <i id="anchor" ref="anchor"></i>
                <Loading transparent={true} isLoading={this.state.isLoading}/>
            </div>
        )
    }
}