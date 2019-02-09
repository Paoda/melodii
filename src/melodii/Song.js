import noalbumart from '../assets/img/noalbumart.png';
import Emitter from './Events';
const mm = window.require('music-metadata');

export default class Song {
    
    /**
     * 
     * @param {String} path 
     * @param {Boolean} ShouldAlbumArtExist 
     */
    constructor(path, ShouldAlbumArtExist) { //whether album art should exist
        this.location = path;
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
            console.warn(metadata.common.title + ' des not have Album Art');
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