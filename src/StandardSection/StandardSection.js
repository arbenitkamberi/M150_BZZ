import React, { Component } from 'react';

import './StandardSection.css';
import UeberUns from '../Sections/Ueberuns/UeberUns.js';
import Angebot from '../Sections/Angebot/Angebot';
import KontaktAnkunft from '../Sections/KontaktAnkunft/KontaktAnkunft';
import Oeffnungszeiten from '../Sections/Oeffnungszeiten/Oeffnungszeiten';
import Reservation from '../Sections/Reservation/Reservation';

/**
 * @param {String} title
 * @param {String} id
 */
class StandardSection extends Component {
    constructor(props){
        super(props);

        this.getSectionContent = this.getSectionContent.bind(this);
    }

    getSectionContent(){
        switch(this.props.id){
            case "ueberuns": return <UeberUns />;
            case "angebot": return <Angebot />;
            case "kontaktAnkunft": return <KontaktAnkunft />;
            case "oeffnungszeiten": return <Oeffnungszeiten />;
            case "reservation": return <Reservation />;
            default: return null;
        }
    }

    render() {
        return (
            <div className="standardSection" id={this.props.id}>
                <div className="titleText sectionTitle">{this.props.title}</div>
                <div className="section">
                    {this.getSectionContent()}
                </div>
            </div>
        );
    }
}

export default StandardSection;
