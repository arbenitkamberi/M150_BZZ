import React, { Component } from 'react';

import './Angebot.css';
import Preisliste from '../../assets/preisliste.jpg';

class Angebot extends Component {
    render() {
        return (
            <div className="angebotContainer">
                <div className="angebot">
                    <table className="angebotTable">
                        <tbody>
                            <tr>
                                <td className="angebotName">Washen, schneiden, föhnen</td>
                                <td className="angebotPreis">49 CHF</td>
                            </tr>
                            <tr>
                                <td className="angebotName">Haarschnitt</td>
                                <td className="angebotPreis">39 CHF</td>
                            </tr>
                            <tr>
                                <td className="angebotName">Haarschnitt mit Schere</td>
                                <td className="angebotPreis">44 CHF</td>
                            </tr>
                            <tr>
                                <td className="angebotName">Washen & föhnen</td>
                                <td className="angebotPreis">21 CHF</td>
                            </tr>
                            <tr><td>&nbsp;</td></tr>
                            <tr>
                                <td className="angebotName">Nassrasur traditionell</td>
                                <td className="angebotPreis">23 CHF</td>
                            </tr>
                            <tr>
                                <td className="angebotName">Konturen definieren</td>
                                <td className="angebotPreis">15 CHF</td>
                            </tr>
                            <tr>
                                <td className="angebotName">Schnurrbart trimmen</td>
                                <td className="angebotPreis">9 CHF</td>
                            </tr>
                            <tr>
                                <td className="angebotName">Bart & pflegen</td>
                                <td className="angebotPreis">33 CHF</td>
                            </tr>
                            <tr><td>&nbsp;</td></tr>
                            <tr>
                                <td className="angebotName">Haar & Bart</td>
                                <td className="angebotPreis">59 CHF</td>
                            </tr>
                            <tr><td>&nbsp;</td></tr>
                            <tr>
                                <td className="angebotName">Augenbrauen (Fadentechnik)</td>
                                <td className="angebotPreis">11 CHF</td>
                            </tr>
                            <tr>
                                <td className="angebotName">Kopfmassage</td>
                                <td className="angebotPreis">7 CHF</td>
                            </tr>
                            <tr>
                                <td className="angebotName">Styling</td>
                                <td className="angebotPreis">12 CHF</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="preislisteContainer">
                    <img className="preisliste"src={Preisliste} alt="Preisliste"/>
                </div>
                <div className="clearFloat"></div>
            </div>
        );
    }
}

export default Angebot;
