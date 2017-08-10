import React from 'react';
export default class NoContent extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        var noContentStyle={
            position: "absolute",
            left: 0,
            right:0,
            top:"30%",
            textAlign: "center",
            color: "#999"
        }
        return (
            <div style={noContentStyle}>
                {this.props.text ? this.props.text : "暂无数据"}
            </div>
        );
    }
}