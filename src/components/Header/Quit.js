import React from 'react';
import Buttons from '../../melodii/Buttons';
// import '@fortawesome/fontawesome-free/css/all.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'

library.add(faTimes);

export default class Quit extends React.Component {
    render() {
        return (
            // <i onClick={this.quit} className= 'fa fa-times'></i>
            <FontAwesomeIcon icon="times" onClick={this.quit} />
        );
    }
    quit() {
        Buttons.quit();
    }
}