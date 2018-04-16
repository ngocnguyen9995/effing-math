import React, { Component } from 'react';
import axios from 'axios';
import Game from './components/Game';
import { Link } from 'react-router-dom';

class App extends Component {
  
    constructor() {
      super();
      this.state = {
        leaderboard: []
      };
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
      return (
        <div class="Container">
          <div class = "panel panel-default">
            <div class = "panel-heading">
              <h3 class = "panel-title" align = "middle">
                F(x)
              </h3>
                <br />
              <div padding = "20px" align = "middle">
                { localStorage.getItem('jwtToken') &&
                  <button class = "btn btn-primary" padding = "15px" onClick = {this.logout}>Logout</button>
                }
                &nbsp;
                 <Link to = '/leaderboard'><button class = "btn btn-primary">Leaderboard</button></Link>
              </div>
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
