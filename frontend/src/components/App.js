import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

import Header from './layouts/Header'
import Alerts from './layouts/Alerts'
import Dashboard from './Dashboard'
import Login from './accounts/Login'
import Register from './accounts/Register'
import PrivateRoute from './common/PrivateRoute'
import Form from './systemhosts/Form'
import Edit from './systemhosts/Edit'

import { Provider } from 'react-redux'
import store from '../store'
import { loadUser } from "../actions/auth";

// Alert Options
const alertOptions = {
    timeout: 3000,
    position: "bottom center"
}

class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser());
    }

    render() {
        return (
            <Provider store={store}>
                <AlertProvider template={AlertTemplate} {...alertOptions}>
                    <Router>
                        <Fragment>
                            <Header />
                            <Alerts />
                            <div className='container content'>
                                <Switch>
                                    <Route exact path="/" component={Dashboard} />
                                    <Route exact path="/register" component={Register} />
                                    <Route exact path="/login" component={Login} />
                                    <PrivateRoute exact path="/create" component={Form} />
                                    <PrivateRoute exact path="/edit/:id" component={Edit} />
                                </Switch>
                            </div>
                        </Fragment>
                    </Router>
                </AlertProvider>
            </Provider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));