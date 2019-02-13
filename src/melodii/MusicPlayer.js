import Emitter from "./Events";
import SongArchive from "./SongArchive";
import Song from './Song';

var mp = new Audio();
var archive = new SongArchive();

export default class MusicPlayer {
    constructor() {
        this.element = mp;
        this.isPaused = false;
    }

    /** Pauses Music and sets currentTime to 0. */
    stop() {
        this.pause();
        this.isPaused = false;
        this.element.currentTime = 0.0;
    }

    /** Pauses Music*/
    pause() {
        this.element.pause();
        this.isPaused = true;
        Emitter.emit("toggle", false);
    }

    /** Plays Music
     * @async
    */
    async play() {
        if (this.isPaused) {
            this.element.play();
            this.isPaused = false;
            Emitter.emit("toggle", true);

            let song = await Song.getMetadata(archive.getCurrentSong());
            document.title = song.metadata.common.title;
        }
    }

    /** Loads Song
     * @param {Song} song
     */
    load(song) {
        if (archive.getCurrentSong() !== undefined)
            archive.add(archive.getCurrentSong());
        let path = song.location;
        archive.setCurrentSong(song);
        if (!this.isPaused) this.pause();

        try {
            this.element.src = this.getURICompatible(path);
            this.element.load();
            console.log(path + " was succesfully loaded");
        } catch (e) {
            console.error(path + " failed to load: " + e.name);
        }
    }

    /** Turns a Filepath into one Chrome can handle
     * @param {string} path
     */
    getURICompatible(path) {
        //eslint-disable-next-line
        return path.replace(/[!'()*#?@$&+,;=\[\]]/g, c => {
            //Excluded '/' '\' ':'
            return "%" + c.charCodeAt(0).toString(16);
        });
    }

    /** Seeks to a certain position in a song 
     * @param {Number} pos
    */
    seek(pos) {
        this.element.currentTime = pos;
    }

    /** gets the Current Time in song.
     * @return {Number} currentTIme
     */
    currentTime() {
        return this.element.currentTime;
    }

    /** gets the Duration of the Song so far.
     * @return {Number} duration
     */
    duration() {
        return this.element.duration;
    }

    /** Sets the Volume of the Audio Element
     * @param {Number} vol
     */
    setVolume(vol) {
        if (vol <= 1) this.element.volume = vol;
        else if (vol < 0) console.error(vol + "is too small (Volume)");
        else if (vol > 1) console.error(vol + " is too large (Volume)");
    }
    
    /** onSongEnd Handler.
     * @param {Object} lastfm   will scrobble track
     * @param {Boolean} random  will choose a random song and play it.
     * @param {Object} playlist will load next song in given playlist
     */
    setOnSongEnd(lastfm, random, playlist) {
        this.element.onended = () => {
            if (random) console.log("random");
            if (lastfm) console.log("lastfm");
            if (playlist) console.log("playlist");
        };
    }
}
