import React from 'react';
import methods from '../assets/methods';
export default class ImeiComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            imei:localStorage.iMeiStr ? localStorage.iMeiStr : ''
        }
    }

    componentDidMount() {
        var self = this;
        var json = {}
        json[self.props.name] = localStorage.iMeiStr ? localStorage.iMeiStr : '';
        self.props.setForms(json);
    }
    render(){
        return (
            <li className="btm-bl">
                <label className="form-key">{this.props.displayName}</label>
                <div className="form-inputbox">
                    <input type="number" placeholder={this.props.placeholder || "请输入"} value={this.state.imei}/>
                </div>
            </li>
        )
    }
}
