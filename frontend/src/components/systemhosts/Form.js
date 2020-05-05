import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { createSystemHost } from '../../actions/systemhosts'
import { getLocProvinces, getLocRegencies, getLocDistricts, getLocVillages } from '../../actions/locations'
import { Redirect } from 'react-router-dom'

export class Form extends Component {
    state = {
        province: "",
        regency: "",
        district: "",
        village: "",
        latitude: "",
        longitude: "",
        next_host: "",
        prev_host: "",
        limit_upper: "",
        limit_middle: "",
        limit_lower: "",
        is_submitting: false,
        submitted: false
    };

    componentDidUpdate(prevProps) {
        const systemhosts = this.props.systemhosts;

        if (systemhosts !== prevProps.systemhosts) {
            this.setState({ submitted: true, is_submitting:false });
        }

        if (this.state.is_submitting)
            this.setState({ is_submitting:false });
    }

    componentDidMount() {
        this.props.getLocProvinces();
    };

    static propTypes = {
        createSystemHost: PropTypes.func.isRequired,
        getLocProvinces: PropTypes.func.isRequired,
        getLocRegencies: PropTypes.func.isRequired,
        getLocDistricts: PropTypes.func.isRequired,
        getLocVillages: PropTypes.func.isRequired,
        provinces: PropTypes.array,
        regencies: PropTypes.array,
        districts: PropTypes.array,
        villages: PropTypes.array,
        systemhosts: PropTypes.array
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    updateRegencies = e => {
        this.props.getLocRegencies(e.target.value);
    };

    updateDistricts = e => {
        this.props.getLocDistricts(e.target.value);
    };

    updateVillages = e => {
        this.props.getLocVillages(e.target.value);
    };

    onSubmit = e => {
        e.preventDefault();
        this.setState({ is_submitting: true });
        const {
            province,
            regency,
            district,
            village,
            latitude,
            longitude,
            next_host,
            prev_host,
            limit_upper,
            limit_middle,
            limit_lower,
            is_submitting
        } = this.state;

        if (is_submitting) return;

        const systemhost = {
            province,
            regency,
            district,
            village,
            latitude,
            longitude,
            next_host,
            prev_host,
            water_level_delimiter_upper: limit_upper,
            water_level_delimiter_middle: limit_middle,
            water_level_delimiter_lower: limit_lower
        };

        this.props.createSystemHost(systemhost)
    };

    render() {
        const {
            province,
            regency,
            district,
            village,
            latitude,
            longitude,
            next_host,
            prev_host,
            limit_upper,
            limit_middle,
            limit_lower,
            is_submitting,
            submitted
        } = this.state;

        if (!is_submitting && submitted){
            return(<Redirect to="/" />);
        }

        return (
            <form onSubmit={this.onSubmit}>
                <div className="card card-body mt-4 mb-4">
                    <h2 className="card-title">Create System Host Form</h2>
                    <hr/>
                    <div className="card mt-2 mb-2">
                        <div className="card-header">
                            <h5 className="card-title mt-2">Location</h5>
                        </div>
                        <div className="card-body">
                            <div className="form-row">
                                <div className="form-group col-md-3">
                                    <label htmlFor="inputProvince">Provinsi</label>
                                    <select id="inputProvince" name="province" className="form-control" onChange={(event) => { this.onChange(event); this.updateRegencies(event);}} value={province} required>
                                        <option key="" value="">Choose...</option>
                                        {this.props.provinces.map(province => (
                                            <option key={province.id} value={province.id}>{province.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="inputRegency">Kota</label>
                                    <select id="inputRegency" name="regency" className="form-control" onChange={(event) => { this.onChange(event); this.updateDistricts(event);}} value={regency} required>
                                        <option key="" value="">Choose...</option>
                                        {this.props.regencies.map(regency => (
                                            <option key={regency.id} value={regency.id}>{regency.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="inputDistrict">Kecamatan</label>
                                    <select id="inputDistrict" name="district" className="form-control" onChange={(event) => { this.onChange(event); this.updateVillages(event);}} value={district}>
                                        <option key="" value="">Choose...</option>
                                        {this.props.districts.map(district => (
                                            <option key={district.id} value={district.id}>{district.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="inputVillage">Kelurahan/Desa</label>
                                    <select id="inputVillage" name="village" className="form-control" onChange={(event) => { this.onChange(event);}} value={village}>
                                        <option key="" value="">Choose...</option>
                                        {this.props.villages.map(village => (
                                            <option key={village.id} value={village.id}>{village.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="inputLatitude">Latitude</label>
                                    <input name="latitude" type="text" className="form-control" id="inputLatitude" placeholder="Latitude { -2.4151646 }" onChange={this.onChange} value={latitude} required/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="inputLongitude">Longitude</label>
                                    <input name="longitude" type="text" className="form-control" id="inputLongitude" placeholder="Longitude { 108.8273471 }" onChange={this.onChange} value={longitude} required/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mt-2 mb-2">
                        <div className="card-header">
                            <h5 className="card-title mt-2">Connection</h5>
                        </div>
                        <div className="card-body">
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="inputPrev">Previous System Host</label>
                                    <select id="inputPrev" name="prev_host" className="form-control" onChange={this.onChange} value={prev_host}>
                                        <option value="">Choose...</option>
                                        <option value="1">...</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="inputNext">Next System Host</label>
                                    <select id="inputNext" name="next_host" className="form-control" onChange={this.onChange} value={next_host}>
                                        <option value="">Choose...</option>
                                        <option value="1">...</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mt-2 mb-2">
                        <div className="card-header">
                            <h5 className="card-title mt-2">Delimiter</h5>
                        </div>
                        <div className="card-body">
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="inputUpper">Upper Limit</label>
                                    <input name="limit_upper" type="number" className="form-control" id="inputUpper" placeholder="2.0000" min="0" max="10" step="0.0001" onChange={this.onChange} value={limit_upper} required/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="inputMiddle">Middle Limit</label>
                                    <input name="limit_middle" type="number" className="form-control" id="inputMiddle" placeholder="1.5000" min="0" max="10" step="0.0001" onChange={this.onChange} value={limit_middle} required/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="inputLower">Lower Limit</label>
                                    <input name="limit_lower" type="number" className="form-control" id="inputLower" placeholder="1.0000" min="0" max="10" step="0.0001" onChange={this.onChange} value={limit_lower} required/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Create</button>
                </div>
            </form>
        )
    }
}

const mapStateToProps = state => ({
    provinces: state.locations.provinces,
    regencies: state.locations.regencies,
    districts: state.locations.districts,
    villages: state.locations.villages,
    systemhosts: state.systemhosts.systemhosts
})

export default connect(mapStateToProps, { createSystemHost, getLocProvinces, getLocRegencies, getLocDistricts, getLocVillages })(Form);
