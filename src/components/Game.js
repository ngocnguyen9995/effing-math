import React, { Component } from 'react'
import Countdown from 'react-countdown-now';
import axios from 'axios';

const Completionist = () => {<span>TOO SLOW. BETTER LUCK NEXT TIME</span>};
const renderer = ({seconds, milliseconds, completed}) => {
    if (completed) {
        return <Completionist />;
    }
    return <span>{seconds}:{milliseconds}</span>
};

const OP = ['+', '-', 'x', '/'];
const PRIMES = [2,3,5,7,11,13,17,19,21,23,29];

class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameOver: false,
            reset: false,
            date: Date.now() + 100000,
            answer: 0,
            first: 0,
            second: 0,
            op: '',
            correctAns: 0,
            difficulty: 1,
            score: 0
        };
    }

    randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    generateQuestion = (op, difficulty) => {
        var randomFirst = 0;
        var randomSecond = 1;
        switch(difficulty){
            case 1:
                randomFirst = this.randomInt(0,10);
                randomSecond = this.randomInt(0,10);
                break;
            case 2:
                randomFirst = this.randomInt(10,21);
                randomSecond = this.randomInt(0,10);
                break;
            case 3: 
                randomFirst = this.randomInt(0,30);
                randomSecond = this.randomInt(0,21);
            default:
                break;
        }
        console.log(randomFirst + ' ' + op + ' '  + randomSecond); 
        if (op === '/' && randomFirst % randomSecond != 0) {
            var max = max(randomFirst, randomSecond);
            var min = min(randomFirst, randomSecond);
            randomFirst = max;
            randomSecond = min;
            if (PRIMES.includes(randomFirst)) {
                ++randomFirst;
            }
            var rem = randomFirst % randomSecond;
            if (rem != 0) {
                if (randomSecond + rem > randomFirst) {
                    randomSecond -= rem;
                } else {
                    randomSecond += rem;
                }
            }
        }
        var ans = 0;
        switch(op) {
            case '+':
                ans = randomFirst + randomSecond;
                break;
            case '-':
                ans = randomFirst - randomSecond;
                break;
            case 'x':
                ans = randomFirst * randomSecond;
                break;
            case '/':
                ans = randomFirst / randomSecond;
                break;
            default:
                break;
        }
        //console.log("First " + randomFirst);
        //console.log("Second " + randomSecond);
        return [randomFirst, randomSecond, ans];
    }

    startQuestion = () => {
        var randomOp = OP[Math.floor(Math.random() * 4)];
        var question = this.generateQuestion(randomOp, this.state.difficulty);
        //console.log(question);
        this.setState({
            first: question[0],
            second: question[1],
            op: randomOp,
            correctAns: question[2]
        });
    }

    updateAnswer = (e) => {
        const name = e.target.name;
        this.setState({
          [name]: e.target.value
        });
    }

    isGameOver = () => {
        return this.state.gameOver; 
    }

    gameOver = () => {
        this.setState({
            gameOver: true
        });
        const username = localStorage.getItem('username');
        const score = this.state.score;
        const currentHighScore = localStorage.getItem('currentHighScore');
        if (score > currentHighScore) {
            console.log("Congratulations! New high score!");
            axios.post('api/game/gameover', {username, score})
            .then((result) =>{
                console.log("Updated highscore")
            })
            .catch((error) => {
                if (error.response.status === 500) {
                console.error("Server error");
                }
            });
        }
    }

    reset = () => {
        this.setState({
            reset: true
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        var currentScore = this.state.score;
        if (this.state.answer != this.state.correctAns) {
            console.log("GameOver")
            this.gameOver();
        } else {
            console.log("Next question");
            currentScore += 10;
            var currentDiff = 1;
            if (currentScore < 50) {
                currentDiff = 1;
            } else if (currentScore >= 50 & currentScore < 100) {
                currentDiff = 2;
            } else if (currentScore >= 100) {
                currentDiff = 3;
            }
            this.setState({
                score: currentScore,
                difficulty: currentDiff
            })
            this.startQuestion();
            this.reset();
        }
    }

    componentDidMount() {
        this.startQuestion();
        //setInterval(() => {
            if (this.state.reset) {
                this.setState({
                    date: Date.now() + 100000,
                    reset: false
                });
            }
        //}, 0);
    }

    render() {
        const answer = this.state.answer;
        const first = this.state.first;
        const second = this.state.second;
        const op = this.state.op;
        const gameOver = this.isGameOver();
        if (!gameOver) {
            return (
                <div>
                    <br />
                    <h3>{first + ' ' + op + ' ' + second + ' = ?'}</h3>
                    <br />
                    <form onSubmit = {this.onSubmit}>
                        <label for = "inputAnswer">Answer</label><br />
                        <input type = "text"
                            name = "answer"
                            value = {answer}
                            onChange = {this.updateAnswer}
                            required
                        />
                        <br />
                        <button type ="submit">Answer</button>
                    </form>
                    <br />
                    <h3>Score: {this.state.score}</h3>
                </div>
            );
        }
        return (
            <h2>Game Over. Better luck next time</h2>
        );
    }
}

export default Game;