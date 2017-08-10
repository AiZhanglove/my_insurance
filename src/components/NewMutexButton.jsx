import React from 'react';
require("./NewMutexButton.less");
export default class NewMutexButton extends React.Component {
    constructor (props){
        super(props);
        // console.log(props)
        this.state = {
            isOpen: props.show,
            styleState:{
                marginLeft: 0,
                backgroundColor:"#ededed"
            }
        }
    }

    handleClick(e){
        var self = this;
        var mutex = self.refs.mutex;
        if (!this.props.disabled) {
            var isOpen = self.state.isOpen;
            self.setState({
                isOpen:!isOpen,
                styleState:{
                    marginLeft: !isOpen ? "1.36rem" : 0,
                    backgroundColor:!isOpen ? "#ff7700" : "#ededed"
                }
            }, function() {
                // console.log(self.state.isOpen, mutex,966666)
                self.props.onClick(self.state.isOpen, mutex);
            })
        }
    }

    componentDidMount(){
        var self = this;
        var mutexOpen = this.props.show;
        var mutex = self.refs.mutex;
        this.setState({
            isOpen:mutexOpen,
            styleState:{
                marginLeft: mutexOpen ? "1.36rem" : 0,
                backgroundColor:mutexOpen ? "#ff7700" : "#ededed"
            }
        });

    }

    componentWillReceiveProps(nextProps){
        var self = this;
        if(nextProps.show != self.state.isOpen){
            self.hook(nextProps);
            // console.log(self.props.show, nextProps)
        }
    }

    hook(nextProps){
        var self = this;
        var mutexOpen = nextProps.show;
        var mutex = self.refs.mutex;
        self.setState({
            isOpen:mutexOpen,
            styleState:{
                marginLeft: mutexOpen ? "1.36rem" : 0,
                backgroundColor:mutexOpen ? "#ff7700" : "#ededed"
            }
        });
    }

    render() {
        var self = this;
        return (
            <div className="mod-mutex_btn mutex-border" onClick={(e) => self.handleClick(e.target)}>
                <div className="mutex mutex-border" ref='mutex' style={self.state.styleState}></div>
            </div>
        )
    }

}