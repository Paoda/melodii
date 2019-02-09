import React from 'react';

export default class SongInfo extends React.Component {
    render() {
        return (
        <span>{this.props.title} - {this.props.artist} | {this.props.album}</span>
        );
    }
}