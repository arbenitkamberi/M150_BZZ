import React, { Component } from 'react';

import HeaderPoint from './HeaderPoint/HeaderPoint';
import {WithContext} from '../App.js';

import logo from '../assets/logo.png';

import './Header.css';

class Header extends Component {
    render() {
        return (
            <div className="header">
                <a className="homeButton" href="/">
                    <img src={logo} alt="Logo" className="logo"></img>
                    <div className="logoName titleText">
                        Al Capone Barbershop
                    </div>
                </a>

                {this.props.context.role === "ADMIN" ?
                    <HeaderPoint text="Admin" link="/admin" />
                    :
                    null
                }
                {this.props.context.role === "GUEST" ? 
                    <HeaderPoint text="Login" link="/login"/>
                    :
                    <HeaderPoint text="Logout" link="/index.html" htmlLink={true} />
                }
            </div>
        );
    }
}

export default WithContext(Header);
