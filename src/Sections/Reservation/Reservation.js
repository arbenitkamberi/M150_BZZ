import React, { Component } from 'react';

import axios from 'axios';

import {WithContext} from '../../App.js';
import {validateReservation} from '../../Validators/Validators.js';
import services from '../../angebote.json';

import './Reservation.css';

class Reservation extends Component {

    constructor(props){
        super(props);

        this.state = {
            reservation: {
                datum: "",
                uhrzeit: "",
                services: [],
                nachricht: ""
            },
            invalidFields: [],
            message: null
        };

        this.setDatum = this.setDatum.bind(this);
        this.setUhrzeit = this.setUhrzeit.bind(this);
        this.setService = this.setService.bind(this);
        this.setNachricht = this.setNachricht.bind(this);
        this.submit = this.submit.bind(this);
    }

    setDatum(event){
        this.setState({...this.state, reservation: {...this.state.reservation, datum: event.target.value}});
    }

    setUhrzeit(event){
        this.setState({...this.state, reservation: {...this.state.reservation, uhrzeit: event.target.value}});
    }

    setService(id){
        let services = this.state.reservation.services;
        let index = services.indexOf(id);
        if(index > -1){
            services.splice(index, 1);
        }
        else{
            services.push(id);
        }
        this.setState({...this.state, reservation: {...this.state.reservation, services}});
    }

    setNachricht(event){
        this.setState({...this.state, reservation: {...this.state.reservation, nachricht: event.target.value}});
    }

    submit(event){
        let invalidFields = validateReservation(this.state.reservation);
        if(invalidFields.length === 0){
            axios({
                method: "post",
                url: `http://${window.location.hostname}:8080/reservation/neu`,
                withCredentials: true,
                data: {...this.state.reservation}
            }).then(res => {
                this.setState({...this.state, message: "Ihre Reservation wurde abgesendet", invalidFields: []});
            }).catch(error => {
                console.log(error);
                if(error.response && error.response.status === 400){
                    this.setState({...this.state, message: null, invalidFields: error.response.data});
                }
                if(error.response && error.response.status === 403){
                    this.setState({...this.state, message: "Sie sind nicht eingeloggt", invalidFields: []});
                }
                else{
                    this.setState({...this.state, message: "Es ist ein Fehler unterlaufen", invalidFields: []});
                }
            });
        }
        else{
            this.setState({...this.state, message: null, invalidFields});
        }
    }

    render() {
        if(this.props.context.role !== "USER"){
            return null;
        }
        return (
            <div className="reservationContainer">
                <div>
                    <form className="reservationForm">
                        <table className="reservationInputsTable">
                            <tbody>
                                <tr>
                                    <td>Datum</td>
                                    <td><input type="date" value={this.state.reservation.datum} onChange={this.setDatum}></input></td>
                                </tr>
                                <tr>
                                    <td>Uhrzeit:</td>
                                    <td><input type="time" value={this.state.reservation.uhrzeit} onChange={this.setUhrzeit}></input></td>
                                </tr>
                                <tr>
                                    <td>Nachricht (optional):</td>
                                    <td><textarea value={this.state.reservation.nachricht} onChange={this.setNachricht} maxlength="250" placeholder="Maximal 250 Zeichen"></textarea></td>
                                </tr>
                                <tr><td className="emptySpace">&nbsp;</td></tr>
                                <tr>
                                    <td className="errorMsg" colSpan={2}>
                                        {this.state.invalidFields.includes("datum") ?
                                            "Es muss ein Datum ausgewählt werden" : null
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className="errorMsg" colSpan={2}>
                                        {this.state.invalidFields.includes("uhrzeit") ?
                                            "Es muss eine Uhrzeit ausgewählt werden" : null
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className="errorMsg" colSpan={2}>
                                        {this.state.invalidFields.includes("nachricht") ?
                                            "Nachricht darf nicht länger als 250 Zeichen sein" : null
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className="errorMsg" colSpan={2}>
                                        {this.state.invalidFields.includes("services") ?
                                            "Es muss mindestens 1 Service ausgewählt sein" : null
                                        }
                                    </td>
                                </tr>
                                <tr className={this.state.message === "Ihre Reservation wurde abgesendet" ? "okMsg" : "errorMsg"}>
                                    <td colSpan={2}>{this.state.message}</td>
                                </tr>
                                <tr>
                                    <td className="submitContainer"><div className="button" onClick={this.submit}>Reservation absenden</div></td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="reservationServicesTable">
                            <tbody>
                                <tr>
                                    <td colSpan={2}>Auswahl Service:</td>
                                </tr>
                                {
                                    services.map(service => {
                                        if(service === null){
                                            return (<tr><td className="emptySpace">&nbsp;</td></tr>);
                                        }
                                        else{
                                            return (
                                                <tr key={service.id} className="reservationService">
                                                    <td>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={this.state.reservation.services.includes(service.id)}
                                                            onChange={() => this.setService(service.id)}
                                                            className="inputCheckbox"
                                                        />
                                                    </td>
                                                    <td className="angebotName">{service.titel}</td>
                                                    <td className="angebotPreis">{service.preis} CHF</td>
                                                </tr>
                                            );
                                        }
                                    })
                                }
                            </tbody>
                        </table>
                        <div className="clearFloat"></div>
                    </form>
                </div>
            </div>
        );
    }
}

export default WithContext(Reservation);
