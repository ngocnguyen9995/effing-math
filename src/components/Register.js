import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

class Create extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            confirm: '',
            message: ''
        };
    }

    onChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        console.log(state.password);
        console.log(state.confirm);
        this.setState(state);
    }

    onSubmit = (e) => {
        e.preventDefault();
        const {username, password, confirm} = this.state;
        if (password !== confirm) {
            this.setState({
                message: "Password and confirmation don't match"
            });
        } else {
        axios.post('/api/auth/register', {username, password})
            .then((result) => {
                this.props.history.push("/login");
            })
            .catch((error) => {
                this.setState({
                    message: "Server error, please try again"
                })
            });
        }
    }

    render() {
        const { username, password, confirm, message } = this.state;
        return(
            <div class = "containter">
                <form class = "form-signin" onSubmit = {this.onSubmit}>
                    { message !== '' &&
                        <div class = "alert alert-warning alert-dismissible" role = "alert">
                            { message }
                        </div> 
                    }
                    <h2 class = "form-signin-heading">Hi, Newbie</h2>
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
                    <label for = "inputPassword" class = "sr-only">Confirm Password</label>
                    <input type = "password" 
                            class = "form-control"
                            placeholder = "Confirm Password"
                            name = "confirm"
                            value = {confirm}
                            onChange = {this.onChange}
                            required
                    />
                    <br />
                    <button class = "btn btn-lg btn-primary btn-block" type = "submit">Sign up</button>
                    <p>
                        Already have an account ?<Link to = "/login">
                        <span class = "glyphicon glyphicon-plus-sign" aria-hidden = "true">
                        </span> Sign in</Link>
                    </p>
                </form>
            </div>
        );
    }
}

export default Create;