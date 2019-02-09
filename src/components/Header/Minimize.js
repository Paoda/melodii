import React from 'react';
import Buttons from '../../melodii/Buttons';
// import '@fortawesome/fontawesome-free/css/all.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMinimize } from '@fortawesome/free-solid-svg-icons'

library.add(faWindowMinimize)

export default class Minimize extends React.Component {
    render() {
        return (
            <FontAwesomeIcon icon="window-minimize" onClick={this.minimize} /> 
            // <i onClick={this.minimize} className= 'fa fa-window-minimize'></i>
        );
    }
    minimize() {
        Buttons.minimize();
    }
}