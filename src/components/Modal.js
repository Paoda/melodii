import React from 'react';
import Emitter from '../melodii/Events';

export default class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: { display: "none" }
    }

    Emitter.on('loadModal', () => {
      this.setState({
        style: { display: "flex" }
      });
    });

  }
  render() {
    console.log("Modal Created");
    return(
      <div 
      className="modal"
      onClick={this.handleClick.bind(this)}
      style={this.state.style}
      >
       {this.props.content}
      </div>  
    )
  }

  shouldComponentUpdate(nProps, nState) {
    
    return (
      this.props.content !== nProps.content ||
      this.state.display !== nState.style.display)
  }

  handleClick() {
    console.log("Dismissing Modal.");
    this.setState({
      style: { display: "none" }
    });
  }
}
