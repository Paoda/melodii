import Song from "../melodii/Song";

const usedTableIDs = [];


/**
 * Finds the ode of a Set of umbers
 * @param {Array<Number>} arr 
 * @return {Number} The Mode
 */
export function mode(arr) {
    //https://codereview.stackexchange.com/a/68431
    return arr.reduce(
        function(current, item) {
            var val = (current.numMapping[item] =
                (current.numMapping[item] || 0) + 1);
            if (val > current.greatestFreq) {
                current.greatestFreq = val;
                current.mode = item;
            }
            return current;
        },
        { mode: null, greatestFreq: -Infinity, numMapping: {} },
        arr
    ).mode;
}

/**
 * Finds the Median of a Set of Numbers
 * @param {Array<Number>} arr 
 * @return {Number} The Median
 */
export function median(arr) {
    arr.sort((a, b) => {
        return a - b;
    });

    let half = ~~(arr.length / 2);

    if (arr.length % 2) return arr[half];
    else return (arr[half - 1] + arr[half]) / 2.0;
}


/**
 * Finds the Average of a Set of Numbers
 * @param {Array<Number>} arr
 * @return {Number} The Average
 */
export function average(arr) {
        let total = 0;
        for (let i = 0; i < arr.length; i++) {
            total += arr[i];
        }
        return total / arr.length;
    }



export class TableText {
    /**
         * Stack Overflow: https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
         * 
         * This Method finds how much hortizontal space text takes up (UTF8 Compliant) using the HTML5 Canvas
         * 
         * @param {String} text Text to Measure
         * @param {String} font Font of Text
         * @param {*} cnvs  Cached Canvas (if it exists)
         * @return {Number} Width of String of Text
         * @static
         */
    static measureText(text, font, cnvs) {
        // let canvas =
        //   self.canvas || (self.canvas = document.createElement("canvas"));
        // let ctx = canvas.getContext("2d");

        let ctx;
        let canvas = cnvs;
        if (canvas) ctx = canvas.getContext("2d");
        else {
            canvas = document.createElement("canvas");
            ctx = canvas.getContext("2d");
        }

        ctx.font = font;
        let metrics = ctx.measureText(text);
        return metrics.width;
    }

    /**
     * This Method Truncates Text given the amount of available horizontal space and the font of the text desired so that
     * All the text fits onto one line. If truncated the String ends up looking like thi...
     * 
     * 
     * @param {String} text Text to be Truncated
     * @param {Number} maxWidth How much Horizontal Space is available to be used up by text.
     * @param {String} font Name of Font
     * @return {String} Truncated Text
     * @static
     */
    static truncateText(text, maxWidth, font) {
        let canvas = document.createElement("canvas");

        let width = TableText.measureText(text, font, canvas);

        if (width > maxWidth) {
            //text needs truncating...
            let charWidths = [];
            let ellipsisWidth = TableText.measureText("...", font, canvas);

            //get Average width of every char in string
            for (let char in text)
                if (typeof char === "string")
                    charWidths.push(TableText.measureText(char, font));

            // let charWidth = this.median(charWidths);
            let charWidth = average(charWidths);
            // let charWidth = this.mode(charWidths);

            //Find out how many of these characters fit in max Width;
            let maxChars = (maxWidth - ellipsisWidth) / charWidth;

            let truncated = "";

            try {
                truncated = text.substr(0, maxChars);
            } catch (e) {
                // console.warn('\n' + e + ' ASSUMPTION: Melodii width shrunk to extremely small proportions');
                // console.warn('Text: "' + text + '"\nMaximum Width: ' + maxWidth + 'px.\nMaximum Space for Characters: ' + maxChars + 'px.');
            }
            return truncated + "...";
        } else return text;
    }
}

/**
* Creates a unique ID that is not UUID compliant.
* - used to distinguish table objects from one another. 
* @param {Number} length 
* @return {String}
*/
export function createID(length) {
   const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
   let id;

   do {
       id = "";
       for (let i = 0; i < length; i++) id += chars[randInt(0, chars.length)];
   } while(usedTableIDs.includes(id));

   usedTableIDs.push(id);
   return id;

   function randInt(min, max) {
       return ~~(Math.random() * (max - min) + min);
   }
}


/**
 * This function takes a Song and the Metadata of said Song and formats it so that it can be easlily processed by Table Generation.
 * @param {Song} song 
 * @param {Object} metadata
 * @return {Object} The Formateed Metadata
 * @static 
 */
export function formatMetadata(song, metadata) {
    let format = metadata.format;
    let common = metadata.common;
    let min = ~~((format.duration % 3600) / 60);
    let sec = ~~(format.duration % 60);
    if (sec < 10) sec = "0" + sec;
    let time = min + ":" + sec;

    return {
        location: song.location,
        time: time,
        artist: common.artist || "",
        title: common.title || "",
        album: common.album || "",
        year: common.year || "",
        genre: common.genre ? common.genre.toString() : "",
        inSeconds: format.duration
    };
}

/**
 * Sorts a Table based on a Term Given to the Method
 * 
 * @param {Object} table Table Object
 * @param {*} term Sort Term
 * @return {Object} Processed Table Object
 * @static
 * 
 */
export function sortTable(table, term) {
    term = term.toLowerCase();
    let tbody = table.tbody.slice();
    
    let res = {
        thead: {
            tr: table.thead.tr.slice()
        },
        tbody: null
    };

    if (term === "title") {
        tbody.sort((a, b) => {
            // turns ["   Uptown Funk"] into ["Uptown Funk"]
            let fixedStr = removeLeadingWhitespaces(
                a.title,
                b.title
            );
            a.title = fixedStr[0];
            b.title = fixedStr[1];

            if (a.title < b.title) return -1;
            else if (a.title > b.title) return 1;
            else return 0;
        });
    } else if (term === "artist") {
        tbody.sort((a, b) => {
            let fixedStr = removeLeadingWhitespaces(
                a.artist,
                b.artist
            );
            a.artist = fixedStr[0];
            b.artist = fixedStr[1];

            if (a.artist < b.artist) return -1;
            else if (a.artist > b.artist) return 1;
            else return 0;
        });
    } else if (term === "album") {
        tbody.sort((a, b) => {
            let fixedStr = removeLeadingWhitespaces(
                a.album,
                b.album
            );
            a.album = fixedStr[0];
            b.album = fixedStr[1];

            if (a.album < b.album) return -1;
            else if (a.album > b.album) return 1;
            else return 0;
        });
    } else if (term === "genre") {
        tbody.sort((a, b) => {
            let fixedStr = removeLeadingWhitespaces(
                a.genre,
                b.genre
            );
            a.genre = fixedStr[0];
            b.genre = fixedStr[1];

            if (a.genre < b.genre) return -1;
            else if (a.genre > b.genre) return 1;
            else return 0;
        });
    } else if (term === "year") {
        tbody.sort((a, b) => {
            return a.year - b.year;
        });
    } else if (term === "time") {
        //term === time convert the time into seconds
        //The messy else if + else is becomes a.inSeconds || b.inSeconds can be undefined.
        tbody.sort((a, b) => {
            if (a.inSeconds && b.inSeconds) {
                return a.inSeconds - b.inSeconds;
            } else if (a.inSeconds || b.inSeconds) {
                if (a.inSeconds) {
                    let parsedB = b.time.split(":");
                    if (parsedB[0][0] === "0") parsedB[0] = parsedB[0][1];
                    if (parsedB[1][0] === "0") parsedB[1] = parsedB[1][1];
                    let totalB =
                        parseInt(parsedB[0], 10) * 60 +
                        parseInt(parsedB[1], 10);
                    b.inSeconds = totalB;

                    return a.inSeconds - totalB;
                } else {
                    let parsedA = a.time.split(":");
                    if (parsedA[0][0] === "0") parsedA[0] = parsedA[0][1];
                    if (parsedA[1][0] === "0") parsedA[1] = parsedA[1][1];
                    let totalA =
                        parseInt(parsedA[0], 10) * 60 +
                        parseInt(parsedA[1], 10);
                    a.inSeconds = totalA;

                    return totalA - b.inSeconds;
                }
            } else {
                let parsedA = a.time.split(":");
                if (parsedA[0][0] === "0") parsedA[0] = parsedA[0][1];
                if (parsedA[1][0] === "0") parsedA[1] = parsedA[1][1];

                let parsedB = b.time.split(":");
                if (parsedB[0][0] === "0") parsedB[0] = parsedB[0][1];
                if (parsedB[1][0] === "0") parsedB[1] = parsedB[1][1];

                let totalA =
                    parseInt(parsedA[0], 10) * 60 +
                    parseInt(parsedA[1], 10);
                let totalB =
                    parseInt(parsedB[0], 10) * 60 +
                    parseInt(parsedB[1], 10);
                a.inSeconds = totalA;
                b.inSeconds = totalB;

                return totalA - totalB;
            }
        });
    }
    if (table.tbody === tbody) console.warn("Music has not been sorted");
    else console.log("Music has been sorted");

    res.tbody = tbody;
    return res;

    
    /**
     * Removes Leading Whitespaces from 2 Strings
     * - Used Exclusively in sortTable()
     *  - Used so that Both Strings can properly be compared
     * @param {String} string1 
     * @param {String} string2 
     * @return {Array<String>} Truncated Strings
     * @static
     */
    function removeLeadingWhitespaces(string1, string2) {
        const regex = /^\s+/i;
        let stringA = string1;
        let stringB = string2;
    
        if (regex.test(stringA)) {
            let spaces = regex.exec(stringA)[0];
            stringA = stringA.substr(spaces.length, stringA.length);
        }
        if (regex.test(stringB)) {
            let spaces = regex.exec(stringB)[0];
            stringB = stringB.substr(spaces.length, stringB.length);
        }
    
        return [stringA, stringB];
    }
}

