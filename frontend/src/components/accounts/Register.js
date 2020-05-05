import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export class Register extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        password_: '',
    }

    onSubmit = e => {
        e.preventDefault();
        console.log("Submit");
    };

    onChange = e => this.setState({
        [e.target.name]: e.target.value
    });

    render() {
        const { username, email, password, password_ } = this.state;

        return (
            <div className="card card-body mt-4 mb-4">
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" className="form-control" placeholder="Username" name="username" required onChange={this.onChange} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" className="form-control" placeholder="Email" name="email" required onChange={this.onChange} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="text" className="form-control" placeholder="Password" name="password" required onChange={this.onChange} />
                    </div>
                    <div className="form-group">
                        <label>Password_</label>
                        <input type="password" className="form-control" placeholder="Password" name="password_" required onChange={this.onChange} />
                    </div>
                    <p>
                        Have an account? <Link to="/login">Login</Link>
                    </p>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }
}

export default Register
