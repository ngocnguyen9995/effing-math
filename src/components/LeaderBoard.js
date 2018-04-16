import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ScoreItem from './ScoreItem';
import './Login.css';

class LeaderBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: []
        }
    }

    fetchLeaderBoard() {
        axios.get('/api/game/leaderboard')
            .then((res) => {
                console.log(res.data.leaderboard);
                this.setState({
                    entries: res.data.leaderboard
                })
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    console.error("Server Error, couldn't get leaderboard");
                }
            });
    }

    componentDidMount(){
        this.fetchLeaderBoard();
    }

    render() {
        let scores;
        if (this.state.entries !== undefined && this.state.entries.length !== 0) {
            scores = this.state.entries.map(entry => {
                return(
                    <ScoreItem key = {entry.Username} entry = {entry} />
                );
            });
        }
        return(
            <div className = "Leaderboard">
                <div class = "Container">
                    <div class = "panel panel-default">
                        <div class = "panel-heading" align = "middle">
                            <h3 class = "panel-title" align = "middle">
                                Leaderboard - The greatest players
                            </h3>
                            <br />
                            <Link to = '/'><button class = "btn btn-primary">Play</button></Link>
                        </div>
                        <br/>
                        <div class = "panel-body">
                            <div className = "Scores" align = "middle">
                                <table class = "table table-stripe">
                                    <thead>
                                        <tr align = "middle">
                                            {scores}
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LeaderBoard;