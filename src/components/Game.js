import React, { Component } from 'react'
import Countdown from 'react-countdown-now';
import axios from 'axios';

const emptyDiv = () => <div/>;


const OP = ['+', '-', 'x', '/'];
const PRIMES = [2,3,5,7,11,13,17,19,21,23,29];

class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameOver: false,
            reset: false,
            date: Date.now() + 100000,
            answer: '',
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

    generateMultiplier = (x) => {
        var y = 2;
        var i;
        for (i = 1; i < PRIMES.length; i++) {
            if (x % PRIMES[i] === 0) {
                y = PRIMES[i];
                break;
            }
        }
        return y;
    }

    generateQuestion = (op, difficulty) => {
        console.log("new question");
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
        if (op === '/') {
            if (PRIMES.includes(randomFirst))
                ++randomFirst;
            randomSecond = this.generateMultiplier(randomFirst);
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
        console.log(question);
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

    renderer = ({seconds, milliseconds, completed}) => {
        if (completed) {
            this.gameOver();
            return <emptyDiv />;
        }
        return <span>{seconds}:{milliseconds}</span>
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
                answer: '',
                score: currentScore,
                difficulty: currentDiff,
                first: 0,
                second: 0,
                op: ''
            });
            this.startQuestion();
            this.reset();
        }
    }

    fetchHighScore = (cb) => {
        const username = localStorage.getItem('username');
        axios.get('api/game/user/' + username)
            .then((result) => {
                console.log(result.data.highscore);
                localStorage.setItem('currentHighScore', result.data.highscore);
                cb();
            })
            .catch((error) => {
                if(error.response.status === 404) {
                    console.error("No such username");
                }
            });
    }

    restartGame = () => {
        this.fetchHighScore(window.location.reload());
    }


    componentDidMount() {
        this.startQuestion();
        setInterval(() => {
            if (this.state.reset) {
                this.setState({
                    date: Date.now() + 100000,
                    reset: false
                });
            }
        }, 0);
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
                    <h2>{first + ' ' + op + ' ' + second + ' = ?'}</h2>
                    <br />
                    <h3>
                        <Countdown
                            date = {this.state.date}
                            intervalDelay = {0}
                            precision = {3}
                            renderer = {this.renderer}
                        />
                    </h3>
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
                    <br />
                    <h3>Personal Best: {localStorage.getItem('currentHighScore')}</h3>
                </div>
            );
        }
        return (
            <div>
                <h2>Game Over. Better luck next time</h2>
                <br/>
                <button onClick = {this.restartGame}>Play Again</button>
            </div>
        );
    }
}

export default Game;