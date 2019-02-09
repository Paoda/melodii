import React from 'react';
import Modal from '../Modal';

const Settings = window.require("electron-settings");

export default class SettingsManager extends Modal {
    constructor() {
        super();
        this.JSX =
        <div className='settings-window'>
            <form>
                <h3>Settings</h3>
                <label for="table-data">
                    Delete Table Data: <input type="button" value="Delete" name="delete-table" id="delete-table-btn" />
                </label>
            </form>
        </div>;
    }
    render() {
        return(
            <Modal content={this.JSX} />
        );
    }
}