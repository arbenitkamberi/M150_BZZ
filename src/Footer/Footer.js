import React, { Component } from 'react';

import './Footer.css';
import Instagram from '../assets/instagram.png';
import Facebook from '../assets/facebook.png';

class Footer extends Component {
    render() {
        return (
            <footer>
                <div className="findUsAt">
                    <span className="findUsAtText">Finde uns auf:</span>
                    <a className="instagramContainer socialMedia" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/alcaponebarber50">
                        <div className="instagramIconContainer socialIconContainer">
                            <img src={Instagram} alt="Instagram" className="instagramIcon socialIcon"></img>
                        </div>
                        <div className="instagramLink socialLink">
                            @alcaponebarber50
                        </div>
                    </a>
                    <a className="facebookContainer socialMedia" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/AlCaponeBarberShopWinterthur">
                        <div className="facebookIconContainer socialIconContainer">
                            <img src={Facebook} alt="Facebook" className="facebookIcon socialIcon"></img>
                        </div>
                        <div className="facebookLink socialLink">
                            @AlCaponeBarberShopWinterthur
                        </div>
                    </a>
                </div>
                <div className="footerRightInfo">
                    Al Capone Barbershop<br></br>
                    Riedhofstrasse 11<br></br>
                    +41 79 832 50 50
                </div>
            </footer>
        );
    }
}

export default Footer;
