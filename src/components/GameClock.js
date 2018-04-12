import React, { Component } from 'react'
import Countdown from 'react-countdown-now';

const Completionist = () => <span>TOO SLOW. BETTER LUCK NEXT TIME</span>

class GameClock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reset: false,
            date: Date.now() + 7000
        };
        this.reset = this.reset.bind(this);
    }

    componentDidMount() {
        setInterval(() => {
            if (this.state.reset) {
                this.setState({
                    date: Date.now() + 7000,
                    reset: false
                });
            }
        }, 0);
    }

    reset() {
        this.setState({
            reset: true
        })
    }

    render() {
        return (
            <div>
                <Countdown date = {this.state.date}>
                    <Completionist />
                </Countdown>
                <br />
                <button onClick={this.reset}>Reset</button>
            </div>
        )
    }
}

export default GameClock;