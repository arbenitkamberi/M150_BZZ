import React, { Component } from 'react';

import {Link} from "react-router-dom";

import './HeaderPoint.css';

/**
 * @param text
 * @param link
 */
class HeaderPoint extends Component {
    render() {
        return (
            <div className="headerPoint">
                {this.props.htmlLink ?
                    <a href={this.props.link} className="navPoint">{this.props.text}</a>
                    :
                    <Link to={this.props.link} className="navPoint">{this.props.text}</Link>
                }
            </div>
        );
    }
}

export default HeaderPoint;
