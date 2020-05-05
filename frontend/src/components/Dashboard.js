import React, { Component, Fragment } from 'react'

import Form from './systemhosts/Form'
import SystemHosts from './systemhosts/SystemHosts'
import Edit from './systemhosts/Edit'
import Graph from './systemhosts/Graph'
import Pumps from './pumps/Pumps'
import { connect } from 'react-redux'

export class Dashboard extends Component {
    render() {
        return (
            <Fragment>
                <SystemHosts />
                { this.props.selected_systemhost_id ? 
                <div className="card card-body mt-4 mb-4">
                    <h2 className="card-title text-center">System Host {this.props.selected_systemhost_id} Detail</h2>
                    <Pumps />
                    { this.props.is_authenticated ?
                    <Edit />
                    : null}
                    <Graph />
                </div>
                : null}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    selected_systemhost_id: state.systemhosts.selected_systemhost_id,
    is_authenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Dashboard)
