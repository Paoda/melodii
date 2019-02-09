import os from "os";
const fs = window.require("fs");

export default class Filepath {

    /**
     * 
     * @param {String} location Filepath
     * @param {Object} cache I don't know what this is.
     */
    constructor(location, cache) {
        this.cache = cache;
        this.location = location;

        if (os.platform() !== "win32") this.slash = "/";
        else this.slash = "\\";
    }

    /**
     * @return {Promise<Array<String>>} list of valid files.
     */
    getValidFiles() {
        return new Promise((res, rej) => {
            this.scan(this.location, (err, list) => {
                if (err) rej(err);
                else {
                    let filteredList = list.filter(arg => {
                        if (
                            arg.match(
                                /^.*\.(flac|mp4|mp3|m4a|aac|wav|ogg)$/gi
                            ) !== null
                        )
                            return true;
                        else return false;
                    });
                    res(filteredList);
                }
            });
        });
    }
    /**
     * 
     * Stack Overflow: http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
     * 
     * Recursively 
     * 
     * @param {String} dir 
     * @param {Object} done Callback
     */
    scan(dir, done) {
        let self = this;
        let results = [];
        fs.readdir(dir, (err, list) => {
            if (err) return done(err);
            let i = 0;
            (function next() {
                let file = list[i++];
                if (!file) return done(null, results);
                file = dir + self.slash + file;
                fs.stat(file, (err, stat) => {
                    if (stat && stat.isDirectory()) {
                        self.scan(file, (err, res) => {
                            results = results.concat(res);
                            next();
                        });
                    } else {
                        results.push(file);
                        next();
                    }
                });
            })();
        });
    }
}
