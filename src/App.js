import React, { Component } from "react";
import "./scss/App.scss";

import Header from "./components/Header.js";
import Body from "./components/Body.js";
import SeekBar from "./components/SeekBar.js";
import AlbumArt from "./components/AlbumArt.js";
import Footer from "./components/Footer.js";
import SettingsManager from "./components/Modal/SettingsManager";

import Song from "./melodii/Song";
import MusicPlayer from "./melodii/MusicPlayer";
import Filepath from "./melodii/Filepath";
import Archive from "./melodii/SongArchive";

var archive = new Archive();
var mp = new MusicPlayer();

// const playlist = new Playlist("Test", "\\\\PAODA-SERVER\\Weeb_Home\\Music")
// archive.add(null, playlist);

const filepath = new Filepath("C:\\Users\\Paoda\\Downloads\\Music");

(async () => {
    let list = await filepath.getValidFiles();

    let song = new Song(list[~~(Math.random() * list.length)], true);
    await song.getMetadata();

    mp.loadSong(song);
    // mp.play();

    mp.element.onended = async () => {
        let song = new Song(list[~~(Math.random() * list.length)], true);
        await song.getMetadata();

        mp.loadSong(song);
        mp.play();
    };
})();

class App extends Component {
    constructor(props) {
        super(props);
        this.seekBarFps = 60; //fps
        this.textFps = 10;
        this.state = {
            currentTime: 0,
            duration: 100,
            title: "",
            artist: "",
            album: ""
        };
    }
    componentDidMount() {
        this.seekBarTimer = window.setInterval(
            this.checkSeekBar.bind(this),
            1000 / this.seekBarFps
        );
        this.textTimer = window.setInterval(
            this.checkText.bind(this),
            1000 / this.textFps
        );
    }
    componentWillUnmount() {
        window.clearInterval(this.seekBarTimer);
        window.clearInterval(this.textTimer);
    }

    /** Updates the Seekbar with the current time. */
    checkSeekBar() {
        if (archive.currentSongExists()) {
            let dur = mp.duration();
            let pos = mp.currentTime();
            if (dur !== this.state.duration) {
                //both position and duration have changed, update both.
                this.setState({
                    currentTime: mp.currentTime() || 0,
                    duration: mp.duration() || 0
                });
            } else if (pos !== this.state.currentTime) {
                this.setState({
                    //only currentTime() has changed
                    currentTime: mp.currentTime() || 0
                });
            }
        }
    }

    /** Updates the Song Text area with the current Song's Title - Artist | Album Name
     * @async
     * @return {void}
     */
    async checkText() {
        if (archive.currentSongExists()) {
            let song = archive.getCurrentSong();
            if (!song.metadata) {
                song = await Song.getMetadata(song);
                console.log("Async checkText() was run");
            }

            if (song.metadata.common.title !== this.state.title) {
                //if title's changed might as well re render entire thing.
                this.setState({
                    title: song.metadata.common.title || "",
                    artist: song.metadata.common.artist || "",
                    album: song.metadata.common.album || ""
                });
            }
        }
    }
    render() {
        return (
            <div className="melodiiContainer">
                <Header />
                <Body />
                <SeekBar
                    currentTime={this.state.currentTime}
                    duration={this.state.duration}
                />
                <AlbumArt />
                <Footer
                    title={this.state.title}
                    artist={this.state.artist}
                    album={this.state.album}
                />
                <SettingsManager />
            </div>
        );
    }
}

export default App;
