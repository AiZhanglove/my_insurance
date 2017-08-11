import React from 'react';
import methods from '../assets/methods';

export default class AddressComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        /*
        这个只需要传入默认的地址即可
        * <AddressComponent setForms={(data) => this.commFrom(data)} value={this.state.myaddress}/>
        * */
    }

    showAddModal(){
        var self = this;
        self.props.layFn({
            showit:"true",
            addressType:self.props.name || "insuredAddress"
        });
    }

    getMyAddress(){
        var self = this;
        methods.Ajax({
            type: 'GET',
            url: '/v1/insurance/userAddress',
            success: function (res) {
                if(res.success){
                    self.props.layFn({
                        myaddress:res.userAddress.provinceName + res.userAddress.cityName + res.userAddress.address,
                        addressJson:res.userAddress
                    });
                    self.props.setForms({
                        allAddress:res.userAddress.provinceName + res.userAddress.cityName + res.userAddress.address,
                        provinceCode:res.userAddress.provinceCode,
                        cityCode:res.userAddress.cityCode,
                        address:res.userAddress.address,
                        type:self.props.name
                    });
                }
            },
            error: function (status) {
                console.log(status);
            }
        })
    }

    componentDidMount() {
        //this.getMyAddress();
    }

    render(){
        return (
            <li className="btm-bl right-arrow">
                <label className="form-key">{this.props.displayName ? this.props.displayName : "地址"}</label>
                <div className="form-inputbox" onClick={() => this.showAddModal()}>
                   <span className={this.props.value ? "datepickerbar numdate" : "datepickerbar placedate" }>{ this.props.value ? this.props.value : this.props.placeholder || "请选择" }</span>
                    {/*<input className="limit-words" placeholder={this.props.placeholder || "请输入"} value={this.props.value} disabled type="text"/>*/}
                </div>
            </li>
        )
    }
}