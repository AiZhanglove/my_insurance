import React from 'react';
import ReactDOM from 'react-dom';
import methods from './assets/methods.js';
import Loading from './components/Loading.jsx';
import NewIndexComponet from './frame/NewIndexComponet.jsx';
export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state={
            isLoading:true,
            cfgs:''
        }
    }

    lazy (selector) {
        //获取屏幕的高度
        var winH = window.innerHeight;
        //滚动处理
        function scrollFn() {
            winH = window.innerHeight;
            [].forEach.call(selector ? document.querySelector(selector).querySelectorAll('img[data-src]') : document.querySelectorAll('img[data-src]'), function (img) {
                if(img.getBoundingClientRect().top <= winH ){
                    img.setAttribute('src', img.getAttribute('data-src'));
                    img.onload = function () {
                        img.removeAttribute('data-src');
                    };
                }
            });
            if(!document.querySelectorAll('img[data-src]').length){
                window.removeEventListener('scroll', scrollFn, false)
            }
        }
        //初始化调用下
        scrollFn();
        //监听滚动
        window.addEventListener('scroll', scrollFn, false);
    }

    getList(pageNum){
        var self = this;
        var hosts = window.location.protocol + "//" + window.location.host;
        var platform = methods.getPlatform() || "web";
        methods.Ajax({
            type: 'GET',
            url: hosts + '/v1/page/home/ins',
            success: function (data) {
                if(data.success){
                    self.setState({
                        cfgs: data.value,
                        isLoading: false
                    },function(){
                        self.lazy();
                    })
                }
            },
            error: function (status) {micloud
                console.log(status)
            }
        });
    }

    componentDidMount(){
        var self =this;
        self.getList()
    }

    render() {
        var self = this;
        return (
            <div>
                {self.state.cfgs && <NewIndexComponet res={self.state.cfgs}/>}
                <Loading isLoading={this.state.isLoading}/>
            </div>
        )
    }
}
ReactDOM.render(
    <App/>,
    document.getElementById('app')
);