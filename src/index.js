import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Login from './components/Login';
import Register from './components/Register';
import LeaderBoard from './components/LeaderBoard';

ReactDOM.render(
    <Router>
        <div>
            <Route exact path = '/' component = {App} />
            <Route path = '/login' component = {Login} />
            <Route path = '/register' component = {Register} />
            <Route path = '/leaderboard' component = {LeaderBoard}/>
        </div>
    </Router>, 
    document.getElementById('root')
);
registerServiceWorker();
