import API from "lastfmapi";

const remote = require("electron").remote;
const process = remote.getGlobal("process");
const settings = require("electron-settings");

/**
 * Handles all Supported https://last.fm API Functions
 */
export default class LastFM {
    /**
     * Creats LastFM with credientials in order to start communicating w/ Last.FM Servers
     * @param {String} apiKey
     * @param {String} secret
     */
    constructor(apiKey, secret) {

        if (apiKey && secret) {
            if (!settings.has("lastfm.apiKey")) {
                //Save API Key
                settings.set("lastfm", {
                    apiKey: apiKey,
                    secret: secret
                });
            } else if (settings.get("lastfm.apiKey") !== apiKey) {
                //APi Keys are Different
                settings.set("lastfm", {
                    apiKey: apiKey,
                    secret: secret
                });
            }
    
            this.api = new API({
                api_key: apiKey, //eslint-disable-line camelcase
                secret: secret,
                useragent: `melodii/v${process.env.npm_package_version} Melodii`
            });
        }
    }

    /**
     * All In one Function which handles entire Authentication Process
     * @async
     */
    enable() {
        return new Promise(async (res, rej) => {
            let token = await this.getToken();
            let sessionKey = await this.getSessionKey(token);
            this.startSession(this.sessionName, sessionKey);
        });
    }

    /**
     * Displays lastFM authentication Page to get Session Key
     * @return {Promise<String>}
     * @async
     */
    getToken() {
        return new Promise((res, rej) => {
            let key = "";

            //create 800x600 chrome window.
            let win = new remote.BrowserWindow({
                width: 800,
                height: 600
            });

            //Load last.fm signin page to get Session Key. (Therefore Giving acess to user's account)
            win.loadURL(
                `http://www.last.fm/api/auth/?api_key=${this.api.api_key}`
            );

            //Don't Show the Window until lastfm is done loading.
            win.webContents.on("did-finish-load", () => {
                win.show();
                win.focus();
            });

            //Grab the Session Key the second LastFM puts it in the URL.
            win.webContents.on("will-navigate", (e, url) => {
                let self = this;
                if (e) rej(e);
                try {
                    let match = url.match(/token=(.*)/g);
                    key = match[0].substring(6, 38); //Guaranteed to be the session key
                    win.close();

                    if (!settings.has("lastfm.token"))
                        settings.set("lastfm.token", key);
                    else if (settings.get("lastfm.token") !== key)
                        settings.set("lastfm.token", key);

                    res(key);
                } catch (e) {
                    rej(e);
                }
            });
        });
    }

    startSession(sessionName, sessionKey) {
        this.api.setSessionCredentials(sessionName, sessionKey);
    }
    /**
     * Returns Session Key
     * @param {String} token
     * @return {Promise<String>} @async
     */
    getSessionKey(token) {
        return Promise((res, rej) => {
            this.api.authenticate(token, (err, session) => {
                if (err) rej(err);

                if (!settings.has("lastfm.session.name")) {
                    settings.set("lastfm.session", {
                        name: session.username,
                        key: session.key
                    });
                } else if (
                    settings.get("lastfm.session.name") !== session.username
                ) {
                    settings.set("lastfm.session", {
                        name: session.username,
                        key: session.key
                    });
                }

                this.sessionName = session.username;
                res(session.key);
            });
        });
    }

    /**
     * Updates nowPlaying on LastFM
     * @param {String} artist
     * @param {String} track
     * @param {String} album
     * @param {String} albumArtist
     */
    nowPlaying(artist, track, album, albumArtist) {
        this.api.track.updateNowPlaying(
            {
                artist: artist,
                track: track,
                album: album,
                albumArtist,
                albumArtist
            },
            (err, nowPlaying) => {
                if (err) throw err;
                console.log("Now Playing Updated");
            }
        );
    }

    /**
     * Scrobbles Song to LastFM
     * @param {String} artist
     * @param {String} track
     * @param {String} album
     * @param {String} albumArtist
     */
    scrobble(artist, track, album, albumArtist) {
        this.api.track.scrobble(
            {
                artist: artist,
                track: track,
                timestamp: 1,
                album: album,
                albumArtist,
                albumArtist
            },
            (err, scrobble) => {
                if (err) throw err;
                console.log("Scrobbling Successful.");
            }
        );
    }
}
