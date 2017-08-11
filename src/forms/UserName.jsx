import React from 'react';
export default class UserName extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            value:props.defaultChooseValue
        };
    }

    listenName(val){
        let names = val.trim();
        if(this.props.name == "policyHolderName"){ //投保人
            this.props.setForms({
                "policyHolderName":names
            });
        }else{ //被保人
            this.props.setForms({
                "insuredName":names
            });
        }
    }

    render(){
        return (
            <li className="btm-bl">
                <label className="form-key">姓&ensp;&ensp;&ensp;&ensp;名</label>
                <div className="form-inputbox">
                    <input ref="name" type="text" placeholder={this.props.placeholder || "请输入"}  defaultValue={this.props.defaultChooseValue} onChange={(e) => {this.listenName(e.target.value)}}/>
                </div>
            </li>
        )
    }
}