import React, { Component } from 'react';
import ReactDom from 'react-dom';
import './AuthCode.less';
import methods from '../../assets/methods.js';

let authCodeWrapperId = 'authCodeContainer';
let singleton = null;
export default class AuthCode extends React.Component {
    constructor(props) {
        super(props);
        singleton = this;
        this.state = {
            codeUrl: [], //验证码图片，要求数组
            tip: '据行业要求，请您输入验证码',
            codeLength: 4, //验证码长度
            codeImgsLen: 1, //验证码个数
            btnTxt: '验证',
            onClose: null,
            autoValidate: true
        };
    }
    show(settings) {
        let self = this;
        settings && this.setState(settings);
        this.clear();
        AuthCode.authCodeContainer.style.display = 'flex';
        setTimeout(function() {
            AuthCode.authCodeContainer.classList.add('show');
            self.refs.codeInput.focus();
        }, 0);
        return this;
    }
    hide() {
        const { onClose } = this.state;
        AuthCode.authCodeContainer.classList.remove('show');
        // setTimeout(function() {
        //     AuthCode.authCodeContainer.style.display = 'none';
        // }, 400);
        AuthCode.authCodeContainer.style.display = 'none';
        this.clear();
        onClose && onClose.call(this);
        return this;
    }
    clear(){
        Array.prototype.map.call(this.codeNums, (item, index) => {
            item.innerHTML = '';
        });
        this.refs.codeInput.value = '';
    }
    destroy() {
        if (singleton) {
            AuthCode.authCodeContainer.parentNode.removeChild(
                AuthCode.authCodeContainer
            );
            AuthCode.authCodeContainer = null;
            singleton = null;
        }
    }
    inputChange() {
        let value = this.refs.codeInput.value;
        const { codeLength, codeImgsLen } = this.state;
        this.refs.codeInput.value = value.substring(
            0,
            codeLength * codeImgsLen
        );
        if (value.length > codeLength * codeImgsLen) return;
        Array.prototype.map.call(this.codeNums, (item, index) => {
            item.innerHTML = value.substring(index, index + 1);
        });
        this.state.autoValidate && this.submit();
    }
    submit() {
        const { codeLength, codeImgsLen } = this.state;
        let code = this.refs.codeInput.value;
        if (code.length < codeLength * codeImgsLen) return;
        const { checkCode } = this.state;
        checkCode && checkCode(code);
    }

    componentWillMount() {
        document.title = '请输入验证码';
        //统计方法
        MiFiLoantracker({
            pageTitle: '保险_车险（新）_转保验证码页',
            productType: 'insurance'
        });
    }

    componentDidMount() {
        this.codeNums = document.querySelectorAll('.code-num span');
    }
    componentDidUpdate() {
        this.codeNums = document.querySelectorAll('.code-num span');
    }
    render() {
        const {
            codeUrl,
            tip,
            codeImgsLen,
            codeLength,
            btnTxt,
            autoValidate
        } = this.state;
        const codeImgs = [];
        if (codeUrl && codeUrl.length > 0) {
            for (let i = 0; i < codeImgsLen; i++) {
                let codeImg = codeUrl[i];
                codeImgs.push(
                    <img
                        key={i}
                        src={codeImg ? 'data:image/jpg;base64,' + codeImg : ''}
                    />
                );
            }
        }

        const codeSpan = [];
        for (let i = 0; i < codeLength * codeImgsLen; i++) {
            codeSpan.push(<span key={i} />);
        }
        return (
            <div
                className={
                    codeImgsLen > 1 ? 'auth-code two-code' : 'auth-code'
                }>
                <div className="code">
                    {codeImgs}
                </div>
                <div className="code-num code-border" ref="codeNums">
                    {codeSpan}
                    <input
                        type="text"
                        className="code-input"
                        ref="codeInput"
                        onChange={() => this.inputChange()}
                    />
                </div>
                <p className="auth-code-tip">
                    {tip}
                </p>
                {!autoValidate
                    ? <button onClick={() => this.submit()}>
                          {btnTxt}
                      </button>
                    : ''}
            </div>
        );
    }
}
AuthCode.init = function() {
    if (!singleton) {
        var authCodeContainer = document.createElement('div');
        AuthCode.authCodeContainer = authCodeContainer;
        authCodeContainer.setAttribute('id', authCodeWrapperId);
        document.body.appendChild(authCodeContainer);
        ReactDom.render(<AuthCode />, authCodeContainer);
    }
    return singleton;
};
AuthCode.show = function(settings) {
    let instance = AuthCode.init();
    settings.show ? instance.show(settings) : instance.hide();
};
AuthCode.hide=function () {
    singleton && singleton.clear();
}
