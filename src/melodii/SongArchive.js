import Song from './Song';
import Playlist from './Playlist';

/** @type {Array<Song>} */
const archive = [];

/** @type {Array<Playlist>} */
const playlists = [];

/** @type {Song} */
let currentSong;

/** @type {Playlist} */
let currentPlaylist;

/**
 * Class for Keeping Information about Current Session of Melodii's Songs
 */
export default class SongArchive {

    /**
     * Adds Song to Archive
     * @param {Song} song 
     * @param {Playlist} playlist 
     */
    add(song, playlist) {
        if (song !== null) {
            if (archive[archive.length - 1] !== song) {
                console.log('Archive Updated.');
                archive.push(song);
            } else console.log('Archive not Updated (Same Song Loaded).');
        } else if (playlist !== null) {
            playlists.push(playlist);
        }
    }

    /**
     * Set the Currently Playing Song
     * @param {Song} song
     */
    setCurrentSong(song) {
        currentSong = song;
    }

    /** @return {SongArchive} The Instanced Archive */
    get() {
        return archive;
    }

    /** @return {Number} Archive length */
    length() {
        return archive.length;
    }

    /** Get the Currently Playing Song
     * @return {Song}
     */
    getCurrentSong() {
        return currentSong;
    }

    /** @return {Boolean} Whether a currently playing song exists or not. */
    currentSongExists() {
        return (currentSong) ? true : false;
    }

    /** Gets the Previously Played Song
     * @return {Song}
     */
    getPreviousSong() {
        let index;
        let pos = archive.indexOf(currentSong);

        if (pos === -1) index = this.length() - 1; //song doesn't exist
        else if (pos === 0) index = 0; //is the first song
        else index = pos -1;

        return archive[index];
    }

    /**
     * Gets a pre-existing Playlist by it's title.
     * @param {String} title 
     */
    getPlaylist(title) {
        let pos = playlists.map(obj => obj.title).indexOf(title);
        return playlists[pos];
    }

    /**
     * Sets the Current Playlist
     * @param {Playlist} playlist 
     */
    setCurrentPlaylist(playlist) {
        currentPlaylist = playlist;
    }

    /**
     * Gets the Curernt Playlist
     * @return {Playlist}
     */
    getCurrentPlaylist() {
        return currentPlaylist;
    }

    /** @return {Boolean} whether a currently playing playlist exists or not */
    currentPlaylistExists() {
        return (currentPlaylist) ? true: false;
    }
}