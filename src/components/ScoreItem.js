import React, { Component } from 'react';

class ScoreItem extends Component {
    render() {
        return (
            <div className = "Score">
                <th>
                    <h3 align = "left">{this.props.entry.Username}</h3>
                </th> 
                <th>
                    <h3 align = "right">{this.props.entry.Highscore}</h3>
                </th>
            </div>
        );
    }
}

export default ScoreItem;