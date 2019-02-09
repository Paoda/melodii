import React from 'react';
import noalbumart from '../assets/img/noalbumart.png';
import Emitter from '../melodii/Events';

export default class AlbumArt extends React.Component {
    constructor() {
        super();
        this.state = {albumArt: noalbumart};

        this.handleEvents();
    }
    shouldComponentUpdate(nextprops, nextState) {
        return this.state.albumArt !== nextState.albumArt;
    }
    render() {
        console.log("Album Art Updated");
        return (
            <div id='albumContainer'>
                <img alt='Album-Art' src={this.state.albumArt} id='albumImg'></img>
            </div>
        );
    }
    /**
     * @listens Song#updateAlbumArt Updates Album Art 
     */
    handleEvents() {
        Emitter.on('updateAlbumArt', (blob, err) => {
            if (err) throw err;
            this.setState({albumArt: blob});
        });
    }
}