import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { editSystemHost } from '../../actions/systemhosts'
import { getLocProvinces, getLocRegencies, getLocDistricts, getLocVillages } from '../../actions/locations'
import { Redirect, useParams } from 'react-router-dom'

export class Edit extends Component {
    static propTypes = {
        getLocProvinces: PropTypes.func.isRequired,
        getLocRegencies: PropTypes.func.isRequired,
        getLocDistricts: PropTypes.func.isRequired,
        getLocVillages: PropTypes.func.isRequired,
        editSystemHost: PropTypes.func.isRequired,
        provinces: PropTypes.array,
        regencies: PropTypes.array,
        districts: PropTypes.array,
        villages: PropTypes.array,
        systemhosts: PropTypes.array,
        selected_systemhost_id: PropTypes.number,
        auth: PropTypes.object.isRequired,
    };

    state = {
        id: "",
        province: "",
        regency: "",
        district: "",
        village: "",
        latitude: "",
        longitude: "",
        next_host: "",
        prev_host: "",
        water_level_delimiter_lower: "",
        water_level_delimiter_middle: "",
        water_level_delimiter_upper: "",
    }

    componentDidUpdate(prevProps) {
        const id = this.props.selected_systemhost_id;
        
        if ( id !== prevProps.selected_systemhost_id ) {
            const systemhost = this.props.systemhosts.find(systemhost => { return systemhost.id == id; });

            if (systemhost) {
                this.props.getLocProvinces();
                this.props.getLocRegencies(systemhost.province);
                if (systemhost.regency) {
                    this.props.getLocDistricts(systemhost.regency);
                    if (systemhost.district) {
                        this.props.getLocVillages(systemhost.district);
                    };
                };

                Object.keys(systemhost).forEach(key => {
                    this.setState({[key]: systemhost[key] ? systemhost[key] : ""})
                });
                
            }
        }
    }

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
        const {
            id,
            province,
            regency,
            district,
            village,
            latitude,
            longitude,
            next_host,
            prev_host,
            water_level,
            water_level_delimiter_upper,
            water_level_delimiter_middle,
            water_level_delimiter_lower
        } = this.state;

        const systemhost = {
            id,
            province,
            regency,
            district,
            village,
            latitude,
            longitude,
            next_host,
            prev_host,
            water_level,
            water_level_delimiter_upper,
            water_level_delimiter_middle,
            water_level_delimiter_lower
        };

        this.props.editSystemHost(systemhost);
    };

    render() {
        const {
            id,
            province,
            regency,
            district,
            village,
            latitude,
            longitude,
            next_host,
            prev_host,
            water_level,
            water_level_delimiter_upper,
            water_level_delimiter_middle,
            water_level_delimiter_lower,
        } = this.state;

        const { auth, selected_systemhost_id } = this.props;

        if ( !auth.isAuthenticated || !selected_systemhost_id ) {
            return null;
        };

        return (
            <form onSubmit={this.onSubmit}>
                <div className="card card-body mt-4 mb-4">
                    <h2 className="card-title">Update System Host Form</h2>
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
                            <h5 className="card-title mt-2">Water Level</h5>
                        </div>
                        <div className="card-body">
                            <div className="form-row">
                                <div className="form-group col-md-3">
                                    <label htmlFor="inputWaterLevel">Water Level</label>
                                    <input name="water_level" type="number" className="form-control" id="inputWaterLevel" placeholder="1.0" min="0" max="10" step="0.0001" onChange={this.onChange} value={water_level} required/>
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="inputUpper">Upper Limit</label>
                                    <input name="limit_upper" type="number" className="form-control" id="inputUpper" placeholder="2.0" min="0" max="10" step="0.0001" onChange={this.onChange} value={water_level_delimiter_upper} required/>
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="inputMiddle">Middle Limit</label>
                                    <input name="limit_middle" type="number" className="form-control" id="inputMiddle" placeholder="1.5" min="0" max="10" step="0.0001" onChange={this.onChange} value={water_level_delimiter_middle} required/>
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="inputLower">Lower Limit</label>
                                    <input name="limit_lower" type="number" className="form-control" id="inputLower" placeholder="1.0" min="0" max="10" step="0.0001" onChange={this.onChange} value={water_level_delimiter_lower} required/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Edit</button>
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
    systemhosts: state.systemhosts.systemhosts,
    selected_systemhost_id: state.systemhosts.selected_systemhost_id,
    auth: state.auth,
})

export default connect(mapStateToProps, { editSystemHost, getLocProvinces, getLocRegencies, getLocDistricts, getLocVillages })(Edit);
