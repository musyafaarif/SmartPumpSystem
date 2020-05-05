import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { logout } from "../../actions/auth";

export class Header extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;
        
        const authLinks = (
            <li className="nav-item">
                <a className="nav-link" href="#" onClick={this.props.logout}>
                    { user ? user.username : 'Logout' }
                </a>
            </li>
        );

        const guestLinks = (
            <li className="nav-item">
                <Link to="/login" className="nav-link">
                    Login
                </Link>
            </li>
        );
        
        return (
            <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
                <div className="container">
                    <Link to="" className="navbar-brand">Smart Pump System</Link>
                    <div className="mr-auto"></div>
                    <ul className="navbar-nav">
                        { isAuthenticated ? authLinks : guestLinks }
                    </ul>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(Header);
