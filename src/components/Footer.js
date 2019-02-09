import React from 'react';
import SongInfo from './Footer/SongInfo';

import PlayPause from './Footer/PlayPause';
import Volume from './Footer/Volume';
export default class Footer extends React.Component {
    render() {
        return (
            <footer>
                <div className='mediaControls'>
                    {/* <SkipBkwd /> */}
                    <PlayPause />
                    {/* <SkipFwd /> */}
                    <Volume />
                </div>
                <div className='songInfo'>
                    <SongInfo title={this.props.title} artist={this.props.artist} album={this.props.album} />
                </div>
            </footer>
        );
    }
}