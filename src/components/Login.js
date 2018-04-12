import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            message: ''
        };
    }

    onChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        axios.post('/api/auth/login', { username, password })
            .then((result) => {
                localStorage.setItem('jwtToken', result.data.token);
                localStorage.setItem('username', username);
                localStorage.setItem('currentHighScore', result.data.highScore);
                this.setState({
                    message: ''
                });
                this.props.history.push('/');
            })
            .catch((error) => {
                if(error.response.status === 401) {
                    console.log("Something wrong here");
                    this.setState({
                        message: 'Wrong username or password'
                    });
                }
            });
    }

    render() {
        const { username, password, message } = this.state;
        return(
            <div class = "containter">
                <form class = "form-signin" onSubmit = {this.onSubmit}>
                    { message !== '' &&
                        <div class = "alert alert-warning alert-dismissible" role = "alert">
                            { message }
                        </div> 
                    }
                    <h2 class = "form-signin-heading">Welcome back</h2>
                    <label for = "inputUsername" class = "sr-only">Username</label>
                    <input type = "username" 
                            class = "form-control"
                            placeholder = "Username"
                            name = "username"
                            value = {username}
                            onChange = {this.onChange}
                            required
                    />
                    <label for = "inputPassword" class = "sr-only">Password</label>
                    <input type = "password" 
                            class = "form-control"
                            placeholder = "Password"
                            name = "password"
                            value = {password}
                            onChange = {this.onChange}
                            required
                    />
                    <button class = "btn btn-lg btn-primary btn-block" type = "submit">Login</button>
                    <p>
                        Don't have an account?<Link to = "/register">
                        <span class = "glyphicon glyphicon-plus-sign" aria-hidden = "true">
                        </span> Sign up to play</Link>
                    </p>
                </form>
            </div>
        );
    }
}

export default Login;