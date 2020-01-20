import React, { Component } from 'react';
import axios from 'axios';
import {Redirect, Link} from "react-router-dom";

import {WithContext} from '../App.js';
import {validateUser} from '../Validators/Validators.js';

import './Registrieren.css';

class Registrieren extends Component {
    constructor(props){
        super(props);
        this.state = {
            user:{
                geschlecht: "M",
                vorname: "",
                nachname: "",
                email: "",
                passwort: "",
                tel: ""
            },
            invalidFields: [],
            errorMsg: null,
            redirectToHome: false
        };

        this.setGeschlecht = this.setGeschlecht.bind(this);
        this.setVorname = this.setVorname.bind(this);
        this.setNachname = this.setNachname.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPasswort = this.setPasswort.bind(this);
        this.setTel = this.setTel.bind(this);
        this.submit = this.submit.bind(this);
    }

    setGeschlecht(event){
        this.setState({...this.state, user: {...this.state.user, geschlecht: event.target.value}});
    }

    setVorname(event){
        this.setState({...this.state, user: {...this.state.user, vorname: event.target.value}});
    }
    
    setNachname(event){
        this.setState({...this.state, user: {...this.state.user, nachname: event.target.value}});
    }

    setEmail(event){
        this.setState({...this.state, user: {...this.state.user, email: event.target.value}});
    }

    setPasswort(event){
        this.setState({...this.state, user: {...this.state.user, passwort: event.target.value}});
    }

    setTel(event){
        this.setState({...this.state, user: {...this.state.user, tel: event.target.value}});
    }

    submit(event){
        let invalidFields = validateUser(this.state.user);
        if(invalidFields.length === 0){
            axios({
                method: "post",
                url: `http://${window.location.hostname}:8080/benutzer/register`,
                withCredentials: true,
                data: {...this.state.user}
            }).then(res => {
                this.props.context.setUserRole(res.data.role);
                this.setState({...this.state, redirectToHome: true});
            }).catch(error => {
                console.log(error);
                if(error.response && error.response.status === 400){
                    this.setState({...this.state, invalidFields: error.response.data, errorMsg: null});
                }
                else if(error.response && error.response.status === 409){
                    this.setState({...this.state, errorMsg: "E-Mail existiert bereits"});
                }
                else{
                    this.setState({...this.state, errorMsg: "Es ist ein Fehler unterlaufen"});
                }
            });
        }
        else{
            this.setState({...this.state, invalidFields, errorMsg: null});
        }
    }

    render(){
        if(this.state.redirectToHome){
            return <Redirect to="/"/>;
        }

        return (
            <div>
                <form className="registerForm">
                    <h1>Registrieren</h1>
                    <table>
                        <tbody>
                            <tr className="errorMsg"><td colSpan={3}>{this.state.errorMsg}</td></tr>
                            <tr>
                                <td className="loginText">Geschlecht:</td>
                                <td>
                                    <select value={this.state.geschlecht} onChange={this.setGeschlecht}>
                                        <option value="M">Männlich</option>
                                        <option value="W">Weiblich</option>
                                        <option value="A">Andere</option>
                                    </select>
                                </td>
                                <td className="errorMsg">
                                    {this.state.invalidFields.includes("geschlecht") ?
                                        "Das Geschlecht muss gewählt sein" : null
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="loginText">Vorname:</td>
                                <td><input type="text" value={this.state.vorname} onChange={this.setVorname}></input></td>
                                <td className="errorMsg">
                                    {this.state.invalidFields.includes("vorname") ?
                                        "Der Vorname darf nicht leer sein und keine Zahlen enthalten" : null
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="loginText">Nachname:</td>
                                <td><input type="text" value={this.state.nachname} onChange={this.setNachname}></input></td>
                                <td className="errorMsg">
                                    {this.state.invalidFields.includes("nachname") ?
                                        "Der Nachname darf nicht leer sein und keine Zahlen enthalten" : null
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="loginText">E-Mail:</td>
                                <td><input type="email" value={this.state.email} onChange={this.setEmail}></input></td>
                                <td className="errorMsg">
                                    {this.state.invalidFields.includes("email") ?
                                        "Ungültige E-Mail" : null
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="loginText">Passwort:</td>
                                <td><input type="password" value={this.state.passwort} onChange={this.setPasswort}></input></td>
                                <td className="errorMsg">
                                    {this.state.invalidFields.includes("passwort") ?
                                        "Das Passwort darf nicht leer sein und darf nur Buchstaben, Zahlen und folgende Sonderzeichen enthalten: ! _ \\ - + ?" : null
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="loginText">Tel-Nr.:</td>
                                <td><input type="text" value={this.state.tel} onChange={this.setTel}></input></td>
                                <td className="errorMsg">
                                    {this.state.invalidFields.includes("tel") ?
                                        "Die Telefon-Nr. muss im folgenden Format sein: beispiel. 0794351849" : null
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td><div className="button" onClick={this.submit}>Konto erstellen</div></td>
                                <td><Link to="/" className="buttonLink"><div className="button">Abbrechen</div></Link></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
}

export default WithContext(Registrieren);