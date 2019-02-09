import React from 'react';
import Modal from '../Modal';

const Settings = window.require("electron-settings");

export default class SettingsManager extends Modal {

    render() {
        const JSX = <div className='settings-window'>Hello</div>
        return(
            <Modal content={JSX} />
        );
    }
}