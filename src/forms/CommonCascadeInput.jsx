import React from 'react';
import methods from '../assets/methods';
export default class CommonCascadeInput extends React.Component {
    // 构造
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <li className="btm-bl right-arrow">
                <label className="form-key">{this.props.displayName}</label>
                <div className="form-inputbox" onClick={() => this.props.showOcc()}>
                    <span className={this.props.value ? "datepickerbar numdate" : "datepickerbar placedate" }>{ this.props.value ? this.props.value : this.props.placeholder || "请选择" }</span>
                    {/*<input className="limit-words" placeholder={this.props.placeholder || "请选择"} value={this.props.value} disabled type="text"/>*/}
                </div>
            </li>
        )
    }
}