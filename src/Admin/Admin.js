import React, { Component } from 'react';

import axios from 'axios';
import {Redirect} from "react-router-dom";

import {WithContext} from '../App.js';

import angebote from '../angebote.json';
import './Admin.css';

class Admin extends Component {
    constructor(props){
        super(props);

        this.state = {
            reservationen: [],
            message: null,
            redirectToLogin: false
        };

        this.reservationBestaetigen = this.reservationBestaetigen.bind(this);
        this.reservationLoeschen = this.reservationLoeschen.bind(this);
        this.reservationenAPI = this.reservationenAPI.bind(this);
        this.updateReservationen = this.updateReservationen.bind(this);
    }

    reservationBestaetigen(reservation){
        this.reservationenAPI(reservation, "bestaetigen");
    }

    reservationLoeschen(reservation){
        this.reservationenAPI(reservation, "loeschen");
    }

    reservationenAPI(reservation, urlPath){
        axios({
            method: "get",
            url: `http://${window.location.hostname}:8080/reservation/${urlPath}/${reservation.user.id}/${reservation.id}`,
            withCredentials: true
        }).then(res => {
            this.updateReservationen();
        }).catch(error => {
            console.log(error);
            if(error.response && error.response.status === 404){
                this.setState({...this.state, message: "Die Reservation wurde nicht gefunden"});
            }
            else if(error.response && (error.response.status === 403 || error.response.status === 401)){
                this.setState({...this.state, redirectToLogin: true});
            }
            else{
                this.setState({...this.state, message: "Es ist ein Fehler unterlaufen"});
            }
        });
    }

    updateReservationen(){
        axios({
            method: "get",
            url: `http://${window.location.hostname}:8080/reservation/BenutzerMitReservationen`,
            withCredentials: true
        }).then(res => {
            let reservationen = [];
            res.data.forEach(user => {
                user.reservationen.forEach(reservation => {
                    if(!reservation.bestaetigt){
                        reservation.user = user;
                        reservationen.push(reservation);
                    }
                });
            });
            reservationen.forEach(reservation => {
                reservation.dauer = 0;
                reservation.services = reservation.services.map(service => {
                    let angebot = angebote.find(angebot => angebot !== null && angebot.id === service) || {};
                    reservation.dauer += angebot.dauer;
                    return angebot;
                });
            });

            this.setState({...this.state, reservationen: reservationen});
        }).catch(error => {
            console.log(error);
            if(error.response && (error.response.status === 403 || error.response.status === 401)){
                this.setState({...this.state, redirectToLogin: true});
            }
            else{
                this.setState({...this.state, message: "Es ist ein Fehler unterlaufen"});
            }
        });
    }

    componentDidMount(){
        if(this.props.context.role === "ADMIN"){
            this.updateReservationen();
        }
    }

    render(){
        if(this.props.context.role !== "ADMIN" || this.state.redirectToLogin){
            return <Redirect to="/login"/>;
        }
        return (
            <div className="adminPage">
                <h1>Admin</h1>
                <h2>Noch nicht bestätigte Reservationen</h2>
                {this.state.message !== null ? <h3>{this.state.message}</h3> : null}
                <table cellSpacing={0}>
                    <tbody>
                        <tr>
                            <th>Geschlecht</th>
                            <th>Vorname</th>
                            <th>Nachname</th>
                            <th>Tel. Nr.</th>
                            <th>E-Mail</th>
                            <th>Datum</th>
                            <th>Uhrzeit</th>
                            <th>Voraussichtliche Dauer</th>
                            <th>Service</th>
                            <th>Nachricht</th>
                            <th>Bestätigen</th>
                            <th>Löschen</th>
                        </tr>
                        {
                            this.state.reservationen.map(reservation => (
                                <tr>
                                    <td>{reservation.user.geschlecht}</td>
                                    <td>{reservation.user.vorname}</td>
                                    <td>{reservation.user.nachname}</td>
                                    <td>{reservation.user.tel}</td>
                                    <td>{reservation.user.email}</td>
                                    <td>{reservation.datum}</td>
                                    <td>{reservation.uhrzeit}</td>
                                    <td>{reservation.dauer} Minuten</td>
                                    <td>
                                        <ul className="adminServicesList">
                                            {reservation.services.map(service => <li key={service.id}>- {service.titel}</li>)}
                                        </ul>
                                    </td>
                                    <td>{reservation.nachricht}</td>
                                    <td>
                                        <button className="button" onClick={() => this.reservationBestaetigen(reservation)}>Bestätigen</button>
                                    </td>
                                    <td>
                                        <button className="button" onClick={() => this.reservationLoeschen(reservation)}>Löschen</button>
                                    </td>
                                </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default WithContext(Admin);