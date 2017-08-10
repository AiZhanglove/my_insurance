import React from 'react';
require("./Button.css");

export default class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: this.props.disabled,
            className: 'btn ' + this.props.className,
            type: this.props.type ? this.props.type : 'button',
            text: null
        };
        //this.propTypes = {
        //    children: React.PropTypes.any,
        //    className: React.PropTypes.string,
        //    disabled: React.PropTypes.bool,
        //    onClick: React.PropTypes.func,
        //    style: React.PropTypes.object,
        //    type: React.PropTypes.oneOf(['submit', 'button'])
        //}
    }

    componentWillReceiveProps(newProps) {
        if (newProps.disabled !== this.props.disabled) {
            this.setState({disabled: newProps.disabled})
        }
    }

    text(text) {
        this.setState({
            text: text
        });
    }

    handleClick(e) {
        if (this.props.onClick) {
            this.props.onClick(e)
        }
    }

    render() {
        return (
            <button className={this.state.className}
                    disabled={this.state.disabled}
                    type={this.state.type}
                    style={this.props.style}
                    role={this.props.role}
                    onClick={this.handleClick.bind(this)}>
                {this.state.text || this.props.children}
            </button>
        );
    }
}
Button.propTypes = {
    children: React.PropTypes.any,
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    style: React.PropTypes.object,
    type: React.PropTypes.oneOf(['submit', 'button'])
}