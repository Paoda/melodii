import React from "react";
import Table, { generate, saveTable } from "./Body/Table";
import Emitter from "../melodii/Events";


const Settings = require("electron-settings");

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
        const self = this;
        Emitter.on("newTable", (obj, err) => {
            if (err) throw err;

            console.log("newTable", obj);
            self.setState({ table: obj });

        });
    }
    componentWillMount() {
        this.initialize();
    }
    shouldComponentUpdate(nextProps, state) {
        if (this.state.table) return this.state.table.id !== state.table.id;
        else return false;
        // On Feb 13 2019 Had problem wehre this.state.table.id was undefined.
        // Unable to replicate issue, but it's a serous one. Probably should fix this yeah?
    }
    render() {
        if (this.state.table) console.log("Render TableID: " + this.state.table.id);
        else console.warn("No Table Present");
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
            let tableJSON = await generate("/home/paoda/Downloads/Music", template);

            console.log("Initialize: ", tableJSON)
            this.setState({ table: tableJSON });
            saveTable(tableJSON);

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
                // type === time
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
        Emitter.emit('loadModal');
    }
}
