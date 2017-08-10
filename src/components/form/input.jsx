import React, { Component } from 'react';
import classNames from 'classnames';
import { Validate } from '../util/index.jsx';
import './index.less';
import { notify } from '../Toast.jsx';
export default class Input extends Component {
    constructor(props) {
        super(props);
    }
    validate() {
        let val = this.refs.input.value;
        let { type } = this.props;
        let rule = this.refs.input.getAttribute('data-validate_rule');
        let res = Validate.check(val, rule);
        if (res.check) {
            this.props.check && this.props.check(this.refs.input,true);
        } else {
            notify.show(res.tip);
            this.props.check && this.props.check(this.refs.input,false);
        }
    }
    render() {
        const { className, placeholder, validate_rule } = this.props;
        const cls = classNames({
            [className]: className
        });
        return (
            <input
                className={cls}
                type="text"
                placeholder={placeholder}
                ref="input"
                data-validate_rule={validate_rule}
                onBlur={() => {
                    this.validate();
                }}
            />
        );
    }
}
