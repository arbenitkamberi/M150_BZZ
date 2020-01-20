import React, { Component } from 'react';
import axios from 'axios';

import {WithContext} from '../App.js';

import {Redirect, Link} from "react-router-dom";

import './Login.css';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: {
                email: "",
                passwort: ""
            },
            redirectToHome: false,
            errorMsg: null
        };

        this.setEmail = this.setEmail.bind(this);
        this.setPasswort = this.setPasswort.bind(this);
        this.submit = this.submit.bind(this);
    }

    setEmail(event){
        this.setState({...this.state, user: {...this.state.user, email: event.target.value}});
    }

    setPasswort(event){
        this.setState({...this.state, user: {...this.state.user, passwort: event.target.value}});
    }

    submit(event){
        document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        axios({
            method: "post",
            url: `http://${window.location.hostname}:8080/benutzer/login`,
            withCredentials: true,
            data: {...this.state.user}
        }).then(res => {
            this.props.context.setUserRole(res.data.role);
            this.setState({...this.state, redirectToHome: true});
        }).catch(error => {
            console.log(error);
            if(error.response && error.response.status === 404){
                this.setState({...this.state, errorMsg: "Falsches Passwort oder falsche E-Mail"});
            }
            else{
                this.setState({...this.state, errorMsg: "Es ist ein Fehler unterlaufen"});
            }
        });
    }

    render(){
        if(this.state.redirectToHome){
            return <Redirect to="/"/>;
        }

        return (
            <div>
                <form className="loginForm">
                    <h1>Login</h1>
                    <table>
                        <tbody>
                            <tr className="errorMsg"><td colSpan={2}>{this.state.errorMsg}</td></tr>
                            <tr>
                                <td className="loginText">E-Mail:</td>
                                <td><input type="email" value={this.state.email} onChange={this.setEmail}></input></td>
                            </tr>
                            <tr>
                                <td className="loginText">Passwort:</td>
                                <td><input type="password" value={this.state.passwort} onChange={this.setPasswort}></input></td>
                            </tr>
                            <tr>
                                <td><div className="button" onClick={this.submit}>Login</div></td>
                                <td><Link to="/registrieren" className="buttonLink"><div className="button">Konto erstellen</div></Link></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
}

export default WithContext(Login);