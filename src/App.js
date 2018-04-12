import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import GameClock from './components/GameClock';

class App extends Component {

    constructor(props) {
      super(props);
      this.state = {
        answer: '',
        correctAns: '',
        score: 0
      }
    }

    renderCountdown = ({seconds, milliseconds, completed}) => {
      if (completed) {
        return <span>TOO SLOW. BETTER LUCK NEXT TIME</span>
      } else {
        return <span>{seconds}:{milliseconds}</span>;
      }
    };

    gameOver = () => {
      const username = localStorage.getItem('username');
      const score = this.state.score;
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

    playGame = () => {
      const {completed, score} = this.state;
    }

    updateAnswer = (e) => {
      const name = e.target.name;
      this.setState({
        [name]: e.target.value
      });
    }

    componentDidMount() {
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/api/game')
        .then(res => {
          console.log('New Game');
        })
        .catch((error) => {
          if (error.response.status === 401) {
            console.log("Redirecting");
            this.props.history.push("/login");
          }
        });
    }

    logout = () => {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('username');
      window.location.reload();
    }

    render() {
      const answer = this.state.answer;
      return (
        <div class="Container">
          <div class = "panel panel-default">
            <div class = "panel-heading">
              <h3 class = "panel-title" align = "middle">
                Welcome To Effin Math&nbsp;
                { localStorage.getItem('jwtToken') &&
                  <button class = "btn btn-primary" align = "right" onClick = {this.logout}>Logout</button>
                }
              </h3>
            </div>
            <div class = "panel-body">
                <table class = "table table-stripe">
                  <thead>
                    <tr>
                      <th>Time Remaining</th>
                      <th>
                        <GameClock/>
                      </th>
                    </tr>
                    <tr>
                      <th colspan = "2">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  </tbody>
                </table>
                <br />
                <form onSubmit = {this.onSubmit}>
                        <label for = "inputAnswer">Answer</label>
                          <input type = "text"
                            pattern = "[0-9]*"
                            name = "answer"
                            value = {answer}
                            onChange = {this.updateAnswer}
                            required
                          />
                </form>
            </div>
          </div>
        </div>
      );
    }
}

export default App;
