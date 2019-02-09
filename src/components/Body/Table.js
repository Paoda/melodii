import React from "react";
import Song from "../../melodii/Song";
import MusicPlayer from "../../melodii/MusicPlayer";
import Misc from "../MiscMethods";
import Emitter from "../../melodii/Events";

/** @type {HTMLElement} */
var active = document.createElement("tr");
active.classList.toggle("active");

const mp = new MusicPlayer();
var JSXcache;

/** The React Component Responsible for Rendering the Song Table */
export default class Table extends React.Component {

    /** Throttles the interval of which the class re-renders when resizing. 
     * @param {Object} props */
    constructor(props) {
        super(props);
        let self = this;
        let throttle;
        window.onresize = e => {
            window.clearTimeout(throttle);
            throttle = setTimeout(() => {
                self.forceUpdate();
            }, 250);
        };
    }

    /**
     * Method responsible for Initializing Table.headJSX and Table.bodyJSX, generating the Table JSX.
     * @param {Object} table Obejct of Elements, Was once JSON (usually)
     */
    initialize(table) {
        this.headJSX = this.parseHead(table);
        this.bodyJSX = this.parseBody(table);
    }

    render() {
        if (this.props.table) {
            if (this.props.table !== JSXcache) {
                this.initialize(this.props.table);
                console.log("Table Rendered from Scratch");
                JSXcache = this.props.table;
                return (
                    <table id="songTable">
                        <thead>
                            <tr>{this.headJSX}</tr>
                        </thead>
                        <tbody>{this.bodyJSX}</tbody>
                    </table>
                );
            } else {
                return (
                    <table id="songTable">
                        <thead>
                            <tr>{this.headJSX}</tr>
                        </thead>
                        <tbody>{this.bodyJSX}</tbody>
                    </table>
                );
            }
        } else {
            return <table id="songTable" />;
        }
    }

    /**
     * Parses the Head Portion of the Table
     * @param {Object} table 
     * @return {Array<HTMLTableHeaderCellElement>}
     */
    parseHead(table) {
        let arr = table.thead.tr;
        return arr.map(string => (
            <th
                key={string}
                onClick={this.handleSort.bind(this, table, string)}>
                {string}
            </th>
        ));
    }
    /**
     * Handles Sorting the table by a Album, Title, Year etc..
     * @fires Table#newTable Event to Generate a new Table
     * @param {Object} table 
     * @param {String} term 
     */
    handleSort(table, term) {
        const temp = table;
        Emitter.emit("newTable", Misc.sortTable(temp, term));
    }

    /**
     * Parses the Body Portion of the Table Object
     * @param {Object} table
     * @return {Array<HTMLTableRowElement>}
     */
    parseBody(table) {
        let arr = table.tbody;
        let clientWidth = document.documentElement.clientWidth;
        let innerWidth = window.innerWidth || 0;
        let maxWidth = Math.max(clientWidth, innerWidth) / 6;

        let temp = arr.map(obj => (
            <tr
                key={obj.location}
                data-filepath={obj.location}
                onClick={this.handleClick.bind(this)}
                onKeyDown={this.handleKeyDown.bind(this)}
                tabIndex="0">
                <td id="text">
                    {Misc.truncateText(obj.artist, maxWidth, "Roboto")}
                </td>
                <td id="text">
                    {Misc.truncateText(obj.title, maxWidth, "Roboto")}
                </td>
                <td id="text">
                    {Misc.truncateText(obj.album, maxWidth, "Roboto")}
                </td>
                <td id="number">
                    {Misc.truncateText(obj.year, maxWidth, "Roboto")}
                </td>
                <td id="text">
                    {Misc.truncateText(obj.genre, maxWidth, "Roboto")}
                </td>
                <td id="number">
                    {Misc.truncateText(obj.time, maxWidth, "Roboto")}
                </td>
            </tr>
        ));
        return temp;
    }

    /**
     * Handles a Click on the Table
     * @param {MouseEvent} e
     * @return {void}
     * @async
     */
    async handleClick(e) {
        if (active !== e.currentTarget) {
            active.classList.toggle("active");
            e.currentTarget.classList.toggle("active");
            active = e.currentTarget;
        } else {
            let filepath = e.currentTarget.dataset.filepath;

            let song = new Song(filepath);
            mp.load(song);
            mp.play();

            song = await Song.getMetadata(song);
            Song.setAlbumArt(song.metadata);
        }
    }
    
    /**
     * Handles a KeyDown Event
     * @param {KeyboardEvent} e
     * @async
     */
    async handleKeyDown(e) {
        // console.log("Focus:" + e.currentTarget.dataset.filepath + " Key: " + e.key);

        if (e.keyCode === 13 && e.currentTarget === active) {
            //Active and Presses Enter
            let filepath = e.currentTarget.dataset.filepath;

            let song = new Song(filepath);
            mp.load(song);
            mp.play();

            song = await Song.getMetadata(song);
            Song.setAlbumArt(song.metadata);
        }
    }
}