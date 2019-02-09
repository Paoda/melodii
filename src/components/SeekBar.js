import React from "react";
import MusicPlayer from "../melodii/MusicPlayer";

var mp = new MusicPlayer();

export default class SeekBar extends React.Component {
    constructor(props) {
        super(props);
        this.isPlayingOnMouseDown = false;
        this.onChangeUsed = false;
    }

    /** @param {Event} e */
    handleChange(e) {
        mp.seek(+e.target.value);
        this.onChangeUsed = true;
    }

    /** @param {KeyboardEvent} e */
    handleMouseDown(e) {
        this.isPlayingOnMouseDown = !mp.isPaused;
        mp.pause();
    }
    
    /** @param {MouseEvent} e */
    handleMouseUp(e) {
        if (!this.onChangeUsed) {
            mp.seek(+e.target.value);
        }
        if (this.isPlayingOnMouseDown) mp.play();
    }
    render() {
        return (
            <div className="seekBar">
                <input
                    type="range"
                    style={{
                        backgroundSize:
                            ((this.props.currentTime || 0) * 100) /
                                (this.props.duration || 0) +
                            "% 100%"
                    }}
                    value={this.props.currentTime || 0}
                    max={this.props.duration || 0}
                    id="seekRange"
                    className="melodiiSlider"
                    onChange={this.handleChange.bind(this)}
                    onMouseDown={this.handleMouseDown.bind(this)}
                    onMouseUp={this.handleMouseUp.bind(this)}
                />
            </div>
        );
    }
}
