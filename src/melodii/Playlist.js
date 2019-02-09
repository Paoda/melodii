import Filepath from "./Filepath";
import Misc from "../components/MiscMethods";
import Song from "./Song";

export default class Playlist {

    /**
     * Creates Playlist with Friendly Title, and Filepath
     * @param {String} title 
     * @param {(String|Filepath)} path
     */
    constructor(title, path) {
        this.initialize(title, path);
    }

    /**
     * Initializes Playlist
     * @param {String} title 
     * @param {(String|Filepath)} path
     * @return {void}
     * @async
     */
    async initialize(title, path) {
        if (typeof path === "string") {
            // is filepath
            this.path = path;
            let filepaths = await new Filepath(path).getValidFiles();
            this.content = await this.getTableData(filepaths);
        } else if (typeof path === "object") {
            //array of songs
            this.path = null;
            this.content = path;
        }
        this.title = title;
    }

    /**
     * Gets Formated Metadata for Table.js
     * @param {Array<String>} filepaths
     * @return {Object} Object of Metadata Information meant for Table Generation
     */
    getTableData(filepaths) {
        return new Promise(async (res, rej) => {
            let content = [];
            for (let i = 0; i < filepaths.length - 1; i++) {
                let song = new Song(filepaths[i]);
                song = await Song.getMetadata(song);
                content.push(Misc.formatMetadata(song, song.metadata));
            }
            res(content);
        });
    }
}
