import React, { Component } from 'react';
import axios from 'axios';
import Game from './components/Game';

class App extends Component {

    renderCountdown = ({seconds, milliseconds, completed}) => {
      if (completed) {
        return <span>TOO SLOW. BETTER LUCK NEXT TIME</span>
      } else {
        return <span>{seconds}:{milliseconds}</span>;
      }
    };

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
      return (
        <div class="Container">
          <div class = "panel panel-default">
            <div class = "panel-heading">
              <h3 class = "panel-title" align = "middle">
                F(x)&nbsp;
                { localStorage.getItem('jwtToken') &&
                  <button class = "btn btn-primary" align = "right" onClick = {this.logout}>Logout</button>
                }
              </h3>
            </div>
            <div class = "panel-body">
                <table class = "table table-stripe">
                  <thead>
                    <tr>
                      <th>
                        <Game/>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  </tbody>
                </table>
                <br />
            </div>
          </div>
        </div>
      );
    }
}

export default App;
