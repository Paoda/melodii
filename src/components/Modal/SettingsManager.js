import React from 'react';
import Modal from '../Modal';
import Emitter from '../../melodii/Events';
import { generate, saveTable } from '../Body/Table';

const Settings = require("electron-settings");

/**
 * The Extension of the Modal Class which is responsible for
 * dealing with the settings, and therefore named SettingsManager
 */
export default class SettingsManager extends Modal {
    constructor() {
        super(); 
        this.template = {
            thead: {
                tr: ["Artist", "Title", "Album", "Year", "Genre", "Time"] //contains <th> strings
            },
            tbody: []
        };

        this.JSX =
        <div className='settings-window'>
            <form>
                <h3>Settings</h3>
                <label htmlFor="table-data">
                    Delete Table Data: <input onClick={this.deleteTable.bind(this)} type="button" value="Delete" name="delete-table" id="delete-table-btn" />
                    <br />
                    Regnerate Table Data: <input onClick={this.regenTable.bind(this)} type="button" value="Regenerate" name="regen-table" id="regen-table-btn" />
                </label>
            </form>
        </div>;
    }

    render() {
        return(
            <Modal content={this.JSX} />
        );
    }

    deleteTable() {
        // const template = this.template;
        // template.id = "-1" // Impossible ID

        const template = JSON.parse(JSON.stringify(this.template)); // Deep Copy (why)

        if (Settings.has("tableJSON")) Settings.set("tableJSON", template);
        else console.info("There was no Table Saved to Delete!");


        Emitter.emit("newTable", template);
    }

    /**
     * Regenerates a Table
     * TODO: Make this a function w/ the one inside of Body.js
     */
    async regenTable() {
        const template = JSON.parse(JSON.stringify(this.template)); // Deep Copy (why)

        if (Settings.has("tableJSON")) Settings.set("tableJSON", template);
        else console.info("There was no Table Saved to Delete!")

        const tableJSON = await generate(process.env.MUSIC_PATH, template);

        Emitter.emit("newTable", tableJSON);

        saveTable(tableJSON);

    }

}