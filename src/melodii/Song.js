import noalbumart from '../assets/img/noalbumart.png';
import Emitter from './Events';
const mm = require('music-metadata');

export default class Song {
    
    /**
     * 
     * @param {String} path 
     * @param {Boolean} ShouldAlbumArtExist 
     */
    constructor(path, shouldCreateAlbumArt = false) { //whether album art should exist
        this.location = path;
        this.title = "";
        this.unf_time = 0;
        this.album = "";
        this.year = 0;
        this.genres = [];
        this.genre = "";

        this.albumArt = "";
        this.albumArtPresent = false;

        this.shouldCreateAlbumArt = shouldCreateAlbumArt;
    }

    /**
     * Gets Metadata from File.
     */
    getMetadata() {
        return new Promise((res, rej) => {
            mm.parseFile(this.location, { native: true, duration: true }).then((metadata) => {
                
                this.metadata = metadata;

                console.log(metadata);

                const format = metadata.format;
                const common = metadata.common;


                this.title = common.title || "";
                this.unf_time = format.duration || 0;
                this.album = common.album || "";
                this.year = common.year || 0;
                this.genre = common.genre ? common.genre.toString() : "";

                if (this.shouldCreateAlbumArt) this.getAlbumArt(common.picture);
                
                
                res();
            }).catch((err) => rej(err));
        });
    }

    /**
     * Finds and Loads Album Art. Saves it to Song instance.
     * TODO: Move the Event emission to only occur when the song is played.
     * @param {*} picture 
     */
    getAlbumArt(picture) {
        if (picture) {
            if (picture.length > 0) {
                console.log(picture);
                const pic = picture[0];

                this.albumArt = URL.createObjectURL(new Blob([pic.data], {
                    'type': pic.format
                }));
                this.albumArtPresent = true;
            } else console.error(this.title + ' Has Album Art, however, no data was found.');

        } else console.warn(this.title, + ' does not have Album Art.');
    }

    displayAlbumArt() {
        console.log("Album Art", this.albumArt);
        console.log("Album Art is Present: ",  this.albumArtPresent)
        if (this.albumArtPresent) Emitter.emit('updateAlbumArt', this.albumart);
        else Emitter.emit('updateAlbumArt', noalbumart);
    }

    get time() {
        let min = ~~((format.duration % 3600) / 60);
        let sec = ~~(format.duration % 60);
        if (sec < 10) sec = "0" + sec;
        return min + ":" + sec;
    }


    /**
     * Gets Metadata from Song
     * @param {Song} song
     * @return {Promise<Song>}
     * @static
     */
    static getMetadata(song) {
        const location = song.location;
        return new Promise((res, rej) => {
            mm.parseFile(location, {native: true, duration: true}).then((metadata) => {
                song.metadata = metadata;
               res(song);
            }).catch((err) => {
                rej(err);
            });
        });
    }

    /**
     * gets and Displays Album Art
     * @param {Object} metadata Song Metadata
     * @static
     */
    static setAlbumArt(metadata) {
        if (metadata.common.picture) {
            if (metadata.common.picture.length > 0) {
                let picture = metadata.common.picture[0];
                let url = URL.createObjectURL(new Blob([picture.data], {
                    'type': 'image/' + picture.format
                }));
                Emitter.emit('updateAlbumArt', url);
            } else {
                console.error(metadata.common.title + ' has Album Art, but no data was present');
                Emitter.emit('updateAlbumArt', noalbumart);
            }
        } else {
            console.warn(metadata.common.title + ' does not have Album Art');
            Emitter.emit('updateAlbumArt', noalbumart);
        }
    }

    /**
     * Combines the functions of Song.getMetadata and Song.setAlbumArt into one.
     * @param {Song} song
     * @return {Promise<Object>}
     * @static
     */
    static doAll(song) {
        return new Promise(async (res, rej) => {
            let metadata = await this.getMetadata(song).catch((err) => rej(err));
            this.setAlbumArt(metadata);
            res(metadata);
        });
    }
}