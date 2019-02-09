import React from "react";
import MusicPlayer from "../../melodii/MusicPlayer";

const Settings = window.require("electron-settings");
const mp = new MusicPlayer();

export default class Volume extends React.Component {
    constructor() {
        super();
        this.state = {
            input: Settings.get("Volume") || 50,
            max: 50
        };
    }
    render() {
        return (
            <input
                style={{
                    backgroundSize:
                        (this.state.input * 100) / this.state.max + "% 100%"
                }}
                value={this.state.input}
                id="volBar"
                type="range"
                max={this.state.max}
                onChange={this.setVolume.bind(this)}
                onMouseUp={this.setLastVolume.bind(this)}
            />
        );
    }
    /**
     * Sets Volume
     * @param {Event} e 
     */
    setVolume(e) {
        this.setState({
            input: e.target.value
        });
        mp.setVolume(e.target.value / 50);
    }
    /**
     * Saves the Previous Volume
     * @param {Event} e 
     */
    setLastVolume(e) {
        Settings.set("Volume", e.target.value);
    }
}
