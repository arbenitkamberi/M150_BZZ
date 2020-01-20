import React, { Component } from 'react';

import './KontaktAnkunft.css';

class KontaktAnkunft extends Component {
    render() {
        return (
            <div className="kontaktAnkunftContainer">
                <div className="kontaktAnkunft">
                    <div className="telefon">
                        <span className="thirdTitle">Telefon</span><br></br>
                        <span>+41 79 832 50 50</span><br></br>
                    </div>
                    <div className="adresse">
                        <span className="thirdTitle">Adresse</span><br></br>
                        <span>Riedhofstrasse 11</span><br></br>
                        <span>8408 Winterthur</span><br></br>
                    </div>
                </div>
                <div className="mapsContainer">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2694.9136430949493!2d8.690677215581145!3d47.51107297917838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479a99579f4c6e3f%3A0x657dce5cd4ce0c6b!2sRiedhofstrasse+11%2C+8408+Winterthur!5e0!3m2!1sde!2sch!4v1540910565557" 
                        width="100%" 
                        height="450" 
                        frameBorder="0" 
                        className="googleMap"
                        title="Al Capone Barber in Google Maps"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="clearFloat"></div>
            </div>
        );
    }
}

export default KontaktAnkunft;
