import React, { Component } from 'react';

import Eingang from '../assets/eingang.jpg';

import './Welcome.css';

//Titelbild
class Welcome extends Component {
    render() {
        return (
            <div className="welcome">
                <div className="welcomeImgContainer">
                    <img src={Eingang} alt="Eingangsbereich"></img>
                    <div className="welcomeTextContainer">
                        <div className="welcomeText">Willkommen zum <br></br>Al Capone Barbershop</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Welcome;
