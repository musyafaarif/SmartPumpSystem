import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createPump, editPump, getPumps, deletePump } from '../../actions/pumps';
import { returnErrors } from '../../actions/messages'

export class Pumps extends Component {
    static propTypes = {
        pumps: PropTypes.array.isRequired,
        createPump: PropTypes.func.isRequired,
        editPump: PropTypes.func.isRequired,
        getPumps: PropTypes.func.isRequired,
        deletePump: PropTypes.func.isRequired,
        returnErrors: PropTypes.func,
        auth: PropTypes.object,
        selected_systemhost_id: PropTypes.number,
    };

    componentDidUpdate(prevProps) {
        const { selected_systemhost_id } = this.props;

        if ( selected_systemhost_id && selected_systemhost_id !== prevProps.selected_systemhost_id ) {
            this.props.getPumps(this.props.selected_systemhost_id);
        }
    }

    componentDidMount() {
        this.props.getPumps(this.props.selected_systemhost_id);
        this.interval = setInterval(() => this.props.getPumps(this.props.selected_systemhost_id), 3000);
    };

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    turn_on = e => {
        var pump = this.props.pumps.find(pump => pump.id === Number(e.target.value))
        
        if (pump.status_level === 1 || pump.status_level === 2){
            pump.status_level = 3
            this.props.editPump(pump)
        }
    }

    turn_off = e => {
        var pump = this.props.pumps.find(pump => pump.id === Number(e.target.value))
        
        if (pump.status_level === 3 || pump.status_level === 4){
            pump.status_level = 2
            this.props.editPump(pump)
        }
    }

    set_maintenance = e => {
        var pump = this.props.pumps.find(pump => pump.id === Number(e.target.value))
        
        if (pump.status_level === 1){
            pump.status_level = 5
            this.props.editPump(pump)
        } else if (pump.status_level === 5) {
            pump.status_level = 1
            pump.last_maintenance_date = new Date()
            this.props.editPump(pump)
        } else {
            this.props.returnErrors({'Set Maintenance': 'Please Turn off the Pump First!'},400)
        }
    }

    create = () => {
        this.props.createPump(this.props.selected_systemhost_id);
    }

    delete = e => {
        this.props.deletePump(e.target.value);
    };

    render() {
        const { selected_systemhost_id, auth } = this.props;

        if (!selected_systemhost_id) {
            return null;
        };

        return (
            <div className="card card-body mt-4 mb-4">
                <h2 className="card-title">Pump List</h2>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th className="text-center">ID</th>
                            <th className="text-center" style={{width:"200px"}}>Status</th>
                            <th className="text-center">Last Maintenance</th>
                            { auth.isAuthenticated ? <th/> : null }
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.pumps.map((pump, index) => (
                            <tr key={pump.id}>
                                <td className="text-center">{pump.id}</td>
                                <td className="text-center">
                                    {
                                        {
                                            1: 'Off',
                                            2: 'Turning Off',
                                            3: 'Turning On',
                                            4: 'On',
                                            5: 'Maintenance',
                                            6: 'Broken',
                                            7: 'Failure'
                                        }[pump.status_level]
                                    }
                                </td>
                                <td className="text-center">{(new Date(pump.last_maintenance_date)).toString()}</td>
                                { auth.isAuthenticated ?
                                <td className="text-right" style={{width:"1px", whiteSpace:'nowrap'}}>
                                    <button value={pump.id} onClick={this.set_maintenance} className='btn btn-primary btn-sm mx-4' style={{width: "35%"}}>{pump.status_level !== 5 ? 'Set Maintenance' : 'Set Ready'}</button>
                                    <button value={pump.id} onClick={this.turn_on} className='btn btn-success btn-sm mx-1'>Turn On</button>
                                    <button value={pump.id} onClick={this.turn_off} className='btn btn-danger btn-sm mx-1'>Turn Off</button>
                                    <button value={pump.id} onClick={this.delete} className='btn btn-danger btn-sm mx-4'>Delete</button>
                                </td>
                                : null }
                            </tr>
                        ))}
                    </tbody>
                </table>
                { auth.isAuthenticated ? 
                <button onClick={this.create} className='btn btn-primary btn-sm mx-2'>Create</button>
                : null }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    pumps: state.pumps.pumps,
    auth: state.auth,
    selected_systemhost_id: state.systemhosts.selected_systemhost_id,
})

export default connect(mapStateToProps, { createPump, editPump, getPumps, deletePump, returnErrors })(Pumps);
