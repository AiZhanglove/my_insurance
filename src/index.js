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
                        // self.lazy();
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
                {
                    /*<h1> 这是标题1222</h1>
                    <div>这是内容</div>*/
                }
                
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