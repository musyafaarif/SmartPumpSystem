import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

export class Login extends Component {
    state = {
        username: '',
        password: '',
    }

    static propTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.login(this.state.username, this.state.password);
    };

    onChange = e => this.setState({
        [e.target.name]: e.target.value
    });

    render() {
        if(this.props.isAuthenticated) {
            return <Redirect to="/" />;
        }

        const { username, password } = this.state;

        return (
            <div className="card card-body mt-4 mb-4">
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" className="form-control" placeholder="Username" name="username" value={username} required onChange={this.onChange} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Password" name="password" value={password} required onChange={this.onChange} />
                    </div>
                    <p>
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                    <button type="submit" className="btn btn-primary">Sign In</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login);
