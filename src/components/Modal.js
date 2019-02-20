import React from 'react';
import Emitter from '../melodii/Events';

/**
 * Brarebones Template for a Modal in Melodii
 * - toggles between visible and not in order to dissapear and reappear.
 */
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
    // Probably should remove once done with debugging
    if (this.state.style.display === "flex") console.log("Modal Show")
    else console.log("Modal Hide");

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

  shouldComponentUpdate(props, state) {
    return this.state.style.display !== state.style.display
  }

  handleClick(e) {
    if(e.target.classList[0] !== "modal") return;

    this.setState({
      style: { display: "none" }
    });
  }
}
