import React from 'react';
require("./MutexButton.css");
export default class MutexButton extends React.Component {
  constructor (props){
      super(props);
      // console.log(props)
      this.state = {
        isOpen: props.show,
        styleState:{
          marginLeft: 0,
          backgroundColor:"#999"
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
          marginLeft: !isOpen ? "15px" : 0,
          backgroundColor:!isOpen ? "#f55152" : "#999"
        }
      }, function() {
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
          marginLeft: mutexOpen ? "15px" : 0,
          backgroundColor:mutexOpen ? "#f55152" : "#999"
        }
    });

  }

  componentWillReceiveProps(nextProps){
    var self = this;
    if(nextProps.show != self.state.isOpen){
       self.hook(nextProps);
    }
  }

  hook(nextProps){
    var self = this;
    var mutexOpen = nextProps.show;
    var mutex = self.refs.mutex;
    self.setState({
      isOpen:mutexOpen,
      styleState:{
          marginLeft: mutexOpen ? "15px" : 0,
          backgroundColor:mutexOpen ? "#f55152" : "#999"
        }
    });
  }

  render() {
    var self = this;
    return (
      <div className="mod-mutex_btn mutex-border" onClick={(e) => self.handleClick(e.target)}>
        <div className="mutex" ref='mutex' style={self.state.styleState}></div>
      </div>
    )
  }

} 