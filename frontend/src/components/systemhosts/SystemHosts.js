import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectSystemHost, getName, getSystemHosts, deleteSystemHost } from '../../actions/systemhosts';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Pumps from '../pumps/Pumps'

export class SystemHosts extends Component {
    static propTypes = {
        systemhosts: PropTypes.object.isRequired,
        getSystemHosts: PropTypes.func.isRequired,
        deleteSystemHost: PropTypes.func.isRequired,
        selectSystemHost: PropTypes.func.isRequired,
        auth: PropTypes.object,
    };

    state = {
        active_page: 1,
    }

    componentDidUpdate(prevProps) {
        const { systemhosts } = this.props;

        if ( systemhosts.need_update !== prevProps.systemhosts.need_update ) {
            if (systemhosts.need_update) {
                this.props.getSystemHosts(this.state.active_page);
            }
        }
    }

    componentDidMount() {
        this.props.getSystemHosts(this.state.active_page)
        this.interval = setInterval(() => this.props.getSystemHosts(this.state.active_page), 3000);
    };

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    delete = e => {
        this.props.deleteSystemHost(e.target.value);
    };

    select = e => {
        this.props.selectSystemHost(e.target.value);
    };

    handlePageChange = (pageNumber) => {
        this.props.getSystemHosts(pageNumber);
        this.setState({ active_page: pageNumber });
    };

    render() {
        const { active_page } = this.state;
        const { isAuthenticated, user } = this.props.auth;
        const { count } = this.props;

        const tableheader_authed = (
            <tr>
                <th className="text-center">ID</th>
                <th className="text-center">Owner</th>
                <th className="text-center">Name</th>
                <th className="text-center">Location</th>
                <th className="text-center">Water Level</th>
                <th className="text-center">Warning Level</th>
                <th />
            </tr>
        )

        const tablebody_authed = (
            this.props.systemhosts.systemhosts.map(systemhost => (
                <tr key={systemhost.id}>
                    <td className="text-center">{systemhost.id}</td>
                    <td className="text-center">{systemhost.owner}</td>
                    <td>{getName(systemhost, 30)}</td>
                    <td>({systemhost.latitude}, {systemhost.longitude})</td>
                    <td className="text-center">{systemhost.water_level}</td>
                    <td className="text-center">Siaga {systemhost.warning_level}</td>
                    <td className="text-right" style={{width:"1px", whiteSpace:'nowrap'}}>
                        <button value={systemhost.id} onClick={this.select} className="btn btn-primary btn-sm mx-2">View</button>
                        <button value={systemhost.id} onClick={this.delete} className='btn btn-danger btn-sm mx-2'>Delete</button>
                    </td>
                </tr>
            ))
        )

        const tableheader_guest = (
            <tr>
                <th className="text-center">Name</th>
                <th className="text-center">Location</th>
                <th className="text-center">Warning Level</th>
                <th></th>
            </tr>
        )

        const tablebody_guest = (
            this.props.systemhosts.systemhosts.map(systemhost => (
                <tr key={systemhost.id}>
                    <td>{getName(systemhost, 30)}</td>
                    <td className="text-center">({systemhost.latitude}, {systemhost.longitude})</td>
                    <td className="text-center">Siaga {systemhost.warning_level}</td>
                    <td className="text-right" style={{width:"1px", whiteSpace:'nowrap'}}>
                        <button value={systemhost.id} onClick={this.select} className="btn btn-primary btn-sm mx-2">View</button>
                    </td>
                </tr>
            ))
        )

        const createLink = (
            <Link to="/create" className="btn btn-primary">Create</Link>
        )

        return (
            <Fragment>
                <div className="card card-body mt-4 mb-4">
                    <h2 className="card-title">System Host List</h2>
                    <table className='table table-striped'>
                        <thead>
                            { isAuthenticated ? tableheader_authed : tableheader_guest }
                        </thead>
                        <tbody>
                            { isAuthenticated ? tablebody_authed : tablebody_guest }
                        </tbody>
                    </table>
                    <Pagination
                        activePage={active_page}
                        itemsCountPerPage={10}
                        totalItemsCount={count}
                        pageRangeDisplayed={5}

                        innerClass="pagination justify-content-center"
                        itemClass="page-item"
                        linkClass="page-link"

                        prevPageText="<"
                        nextPageText=">"

                        onChange={this.handlePageChange.bind(this)}

                        hideFirstLastPages
                    />
                    { isAuthenticated ? createLink : null }
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    count: state.systemhosts.count,
    systemhosts: state.systemhosts,
    auth: state.auth
})

export default connect(mapStateToProps, { selectSystemHost, getSystemHosts, deleteSystemHost })(SystemHosts);
