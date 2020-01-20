import React, { Component } from 'react';

import Opened from '../../assets/opened.jpg';

import './Oeffnungszeiten.css';

class Oeffnungszeiten extends Component {
    render() {
        return (
            <div className="oeffnungszeitenContainer">
                <div className="oeffnungszeiten">
                    <table className="oeffnungszeitenTable">
                        <tbody>
                            <tr>
                                <td>Dienstag - Samstag</td>
                                <td>9:00 - 19:00</td>
                            </tr>
                            <tr>
                                <td>Sonntag - Montag</td>
                                <td>Geschlossen</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="oeffnungszeitenBild">
                    <img src={Opened} alt="Geöffnet"/>
                </div>
                <div className="clearFloat"></div>
            </div>
        );
    }
}

export default Oeffnungszeiten;
