import React, { Component } from 'react';

import Header from './Header/Header.js';
import Welcome from './Welcome/Welcome.js';
import StandardSection from './StandardSection/StandardSection.js';
import Footer from './Footer/Footer.js';
import Login from './Login/Login.js';
import Registrieren from './Registrieren/Registrieren.js';
import Admin from './Admin/Admin.js';

import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import './App.css';

const UserContext = React.createContext();

class App extends Component {

    constructor(props){
        super(props);

        this.setUserRole = role => {
            this.setState({...this.state, role});
        }

        this.state = {
            role: "GUEST",
            setUserRole: this.setUserRole
        };
    }

    render() {
        return (
            <UserContext.Provider value={this.state}>
                <Router>
                    <div className="app">
                        <Switch>
                            <Route path="/login">
                                <Login/>    
                            </Route>
                            <Route path="/registrieren">
                                <Registrieren />
                            </Route>
                            <Route path="/admin">
                                <Admin />
                            </Route>
                            <Route path="/">
                                <Header />
                                <Welcome />
                                <StandardSection title="Über uns" id="ueberuns"/>
                                <StandardSection title="Angebot" id="angebot"/>
                                <StandardSection title="Kontakt & Ankunft" id="kontaktAnkunft"/>
                                <StandardSection title="Öffnungszeiten" id="oeffnungszeiten"/>
                                {this.state.role === "USER" ?
                                    <StandardSection title="Reservation" id="reservation"/>
                                    :
                                    null
                                }
                                <Footer />
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </UserContext.Provider>
        );
    }
}

function WithContext(Component){
    return props => (
        <UserContext.Consumer>
             {value =>  <Component {...props} context={value} />}
        </UserContext.Consumer>
    );
}

export {App, WithContext};
