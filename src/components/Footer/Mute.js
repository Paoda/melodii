import React from 'react';
// import '@fortawesome/fontawesome-free/css/all.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';

library.add(faVolumeUp)

export default class Mute extends React.Component {
    render() {
        return (
            // <i className= 'fa fa-volume-up' id='muteIcon'></i>
            <FontAwesomeIcon icon="faVolumeUp" id='muteIcon' />
        );
    }
}