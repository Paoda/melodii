import React from 'react';
import Modal from '../Modal';
import Emitter from '../../melodii/Events';
import { generate, saveTable } from '../Body/Table';

const Settings = window.require("electron-settings");

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

        const template = {
            thead: {
                tr: ["Artist", "Title", "Album", "Year", "Genre", "Time"] //contains <th> strings
            },
            tbody: []
        };

        if (Settings.has("tableJSON")) Settings.set("tableJSON", template);
        else console.info("There was no Table Saved to Delete!");


        Emitter.emit("newTable", template);
    }

    /**
     * Regenerates a Table
     * TODO: Make this a function w/ the one inside of Body.js
     */
    async regenTable() {

        /*
            Rather Large Problem w/ regenTable() and deleteTable()
            I need const template to be a reference to a different object of this.template
            (Pass by value instead of pass by reference)

            Both deleteTable() and regenTable() modify this.table, which is not the intended behaviour.


            Temporary soltuoin will be to define template in each funciton, but I need to figure out how to 
            copy the object instead of reference the object.
        */
        // const template = this.template;
        // template.id = "-1";

        const template = {
            thead: {
                tr: ["Artist", "Title", "Album", "Year", "Genre", "Time"] //contains <th> strings
            },
            tbody: []
        };

        if (Settings.has("tableJSON")) Settings.set("tableJSON", template);
        else console.info("There was no Table Saved to Delete!")

        const tableJSON = await generate("C:\\Users\\Paoda\\Downloads\\Music", template);

        Emitter.emit("newTable", tableJSON);

        saveTable(tableJSON);

    }

}