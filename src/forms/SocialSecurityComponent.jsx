import React from 'react';
export default class SocialSecurityComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            options:props.value ? props.value : "HAVE"
        };
    }

    getResult(e){
        var self = this;
        var oldVal = self.state.options;
        var newVal = e.target.value;
        if(oldVal != newVal){
            self.setState({
                "options":newVal
            })
        }
        var json = {}
        json[self.props.name] = newVal;
        this.props.setForms(json,self.props.index);
    }

    componentDidMount() {
        var self = this;
        if(!self.props.value){
            var json = {}
            json[self.props.name] = self.state.options;
            this.props.setForms(json,self.props.index);
        }
    }

    render(){
        var self = this;
        return (
            <ul className="ins-form_newcommon">
                <li className="btm-bl right-arrow">
                    <label className="form-key">{this.props.displayName ? this.props.displayName : "社保"}</label>
                    <div className="form-inputbox">
                        {
                            self.props.rangeItems &&  <select value={self.state.options} onChange={(e) => self.getResult(e)}>
                                {
                                    self.props.rangeItems.map(function (ele,indx) {
                                        return (
                                            <option key={indx} value={ele.name}>{ele.displayName}</option>
                                        )
                                    })
                                }
                            </select>
                        }
                    </div>
                </li>
            </ul>
        )
    }
}