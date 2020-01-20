import React, { Component } from 'react';

import Bar from '../../assets/bar.jpg';

import './UeberUns.css';

class UeberUns extends Component {
    render() {
        return (
            <div>
                <div className="ueberUnsTextContainer">
                    <div className="ueberUnsTextTitle">Al Capone Barbershop in Winterthur</div>
                    <div className="ueberUnsText">
                        ist nicht nur ein Barbershop, sondern ein Rückzugsort für die Herrenwelt, 
                        wo sich die Männer zurückziehen können und den Service eines Barbiers geniessen.
                    </div>
                </div>
                <div className="ueberUnsImgContainer">
                    <img src={Bar}  alt="Bar"></img>
                </div>
                <br className="clearAll" />
            </div>
        );
    }
}

export default UeberUns;
