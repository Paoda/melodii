import React from "react";
import Table from "./Body/Table";
import Song from "../melodii/Song";
import Filepath from "../melodii/Filepath";
import Misc from "./MiscMethods";
import Emitter from "../melodii/Events";
import Modal from "./Modal";


const Settings = window.require("electron-settings");

export default class Body extends React.Component {
    constructor() {
        super();
        this.state = {
            table: null,
            msg: ""
        };
    }

    /** @listens Table#newTable loads new Table*/
    handleEvents() {
        Emitter.on("newTable", (obj, err) => {
            if (err) throw err;
            this.setState({ table: obj });
        });
    }
    componentWillMount() {
        this.initialize();
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.table !== nextState.table;
    }
    render() {
        return (
            <div className="wrapper">
                <div id="searchBar">
                    <input
                        type="text"
                        placeholder="Search..."
                        onKeyUp={this.checkKey.bind(this)}
                        tabIndex="0"
                    />
                    <input
                        type="button"
                        onClick={this.openSettings.bind(this)}
                        value="Settings"
                    />
                    <span id="bad-search-syntax" />
                </div>
                <Table table={this.state.table} />
            </div>
        );
    }

    /** Initializes Body Element (Therefore Table too) @async @return {void}*/
    async initialize() {
        this.handleEvents.bind(this);
        this.handleEvents();

        let template = {
            thead: {
                tr: ["Artist", "Title", "Album", "Year", "Genre", "Time"] //contains <th> strings
            },
            tbody: []
        };

        if (!Settings.has("tableJSON")) {
            let tableJSON = await this.generate(template);

            this.setState({
                table: tableJSON
            });

            let timestamp = Date.now();
            Settings.set("tableJSON", {
                data: tableJSON,
                timestamp: timestamp
            });

            let date = new Date(timestamp);
            console.log(
                "Table data created at: " +
                    date.toDateString() +
                    " at " +
                    date.toTimeString()
            );
        } else {
            console.log("Data Loaded from Persistent Storage Space");

            this.setState({
                table: Settings.get("tableJSON").data
            });

            let date = new Date(Settings.get("tableJSON").timestamp);
            console.log(
                "Table data created on: " +
                    date.toDateString() +
                    " at " +
                    date.toTimeString()
            );
        }
    }

    /**
     * Generates Table From Scratch
     * @param {Array<String>} template
     * @return {Promise<} 
     * @async
     */
    async generate(template) {
        let filepath = new Filepath("C:\\Users\\Paoda\\Downloads");
        let list = await filepath.getValidFiles();
        console.log("Found " + list.length + "valid files.");
        return new Promise(async (res, rej) => {
            let temp = await this.generateBody(
                template,
                list,
                0,
                list.length - 1
            );
            res(temp);
        });
    }

    /**
     * Generates Body of Table from Scratch 
     * @param {Object} tableArg Table Element 
     * @param {Array<String>} arr Array of Valid Song Files 
     * @param {Number} start of Array
     * @param {Number} end of Array
     * @return {Object} Table Object with Body Completely parsed.
     * @async
     */
    async generateBody(tableArg, arr, start, end) {
        let table = tableArg;
        let t1 = performance.now();
        let dom = document.getElementById("bad-search-syntax");
        for (let i = 0; i <= end; i++) {
            let song = new Song(arr[i]);
            song = await Song.getMetadata(song);
            table.tbody.push(Misc.formatMetadata(song, song.metadata));
            dom.innerHTML = "Creating Table Data: " + ~~((i / end) * 100) + "%";
        }
        let t2 = performance.now();
        console.log(
            "Time Taken (Table Data Creation): " +
                Math.floor(t2 - t1) / 1000 +
                "s"
        );

        return new Promise((res, rej) => {
            res(table);
        });
    }
   
    /**
     * Handles Key Presses
     * @param {KeyboardEvent} e 
     */
    checkKey(e) {
        if (e.keyCode === 13) this.search(e.target.value);
    }

    /**
     * Searches for Elements using a the provided String Parameter as an argument.
     * - Directly Manipulates the State of Body once it's done so it returns void
     * @param {String} string 
     */
    search(string) {
        const table = Settings.get("tableJSON").data;
        console.log("Search Text: " + string);

        if (string === "") {
            this.setState({ table: table });
        } else if (string.includes(":")) {
            let type = string.match(/^(.*):/)[0];
            type = type.substr(0, type.length - 1);

            let term = string.match(/:( ?.*)$/)[0];
            if (term[1] === " ") term = term.substr(2, term.length);
            else term = term.substr(1, term.length);

            type = type.toLowerCase();

            let temp = {
                tbody: null,
                thead: table.thead
            };

            if (type === "title") {
                term = term.toLowerCase();
                temp.tbody = table.tbody.filter(obj =>
                    obj.title.toLowerCase().includes(term)
                );
            } else if (type === "artist") {
                term = term.toLowerCase();
                temp.tbody = table.tbody.filter(obj =>
                    obj.artist.toLowerCase().includes(term)
                );
            } else if (type === "album") {
                term = term.toLowerCase();
                temp.tbody = table.tbody.filter(obj =>
                    obj.album.toLowerCase().includes(term)
                );
            } else if (type === "genre") {
                term = term.toLowerCase();
                temp.tbody = table.tbody.filter(obj =>
                    obj.genre.toLowerCase().includes(term)
                );
            } else if (type === "year") {
                term = parseInt(term, 10);
                temp.tbody = table.tbody.filter(obj => obj.year === term);
            } else {
                // type == time
                term = term.toLowerCase();
                temp.tbody = table.tbody.filter(obj =>
                    obj.time.toLowerCase().includes(term)
                );
            }
            this.setState({ table: temp });
            let error = document.getElementById("bad-search-syntax");
            if (error.innerHTML !== "") error.innerHTML = "";
            console.log("Search found: " + temp.tbody.length + " Songs");
        } else {
            document.getElementById("bad-search-syntax").innerHTML =
                "Invalid Syntax!";
        }
    }

    openSettings() {
        const settings = document.querySelector('.settings-window');
        Emitter.emit('loadModal');

    }
}
