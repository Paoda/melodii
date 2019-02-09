import React from "react";
import Emitter from "../../melodii/Events";
import MusicPlayer from "../../melodii/MusicPlayer";
// import "@fortawesome/fontawesome-free/css/all.css";

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'


library.add(faPause);
library.add(faPlay);

const mp = new MusicPlayer();
export default class PlayPause extends React.Component {

    /** @listens */
    constructor(props) {
        super(props);

        Emitter.on("toggle", bool => this.handleEvent(bool));

        this.state = { icon: "pause" };
    }

    handleClick() {
        //Updates Icon and controls the Audio came from clicking on button
        if (this.state.icon === "pause") {
            //set to play
            mp.pause();
            this.setState({ icon: "play" });
        } else {
            //set to pause
            mp.play();
            this.setState({ icon: "pause" });
        }
    }

    /**
     * Updates Icon From Event
     * @param {Boolean} bool 
     */
    handleEvent(bool) {
        if (!bool) this.setState({ icon: "play" });
        else this.setState({ icon: "pause" });
    }
    render() {
        return ( 
            <FontAwesomeIcon icon={this.state.icon} id="playPause" onClick={this.handleClick.bind(this)} />
        );
    }
}
