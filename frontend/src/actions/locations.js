import axios from 'axios'

import { GET_LOC_PROVINCE, GET_LOC_REGENCY, GET_LOC_DISTRICT, GET_LOC_VILLAGE, GET_ERRORS } from './types'

// GET PROVINCES
export const getLocProvinces = () => dispatch => {
    axios
        .get('/loc/province/')
        .then(res => {
            dispatch({
                type: GET_LOC_PROVINCE,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: {
                    msg: err.response.data,
                    status: err.response.status
                }
            });
        });
}

// GET REGENCIES
export const getLocRegencies = (province_id = null, url = "/loc/regency/") => dispatch => {
    if (province_id !== null) {
        url = url.concat(`?province_id=${province_id}`);
    }

    axios
        .get(url)
        .then(res => {
            dispatch({
                type: GET_LOC_REGENCY,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: {
                    msg: err.response.data,
                    status: err.response.status
                }
            });
        });
}

// GET DISTRICTS
export const getLocDistricts = (regency_id = null, province_id = null, url = "/loc/district/") => dispatch => {
    if (regency_id !== null) {
        url = url.concat(`?regency_id=${regency_id}`);
    } else if (province_id !== null) {
        url = url.concat(`?province_id=${province_id}`);
    }

    axios
        .get(url)
        .then(res => {
            dispatch({
                type: GET_LOC_DISTRICT,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: {
                    msg: err.response.data,
                    status: err.response.status
                }
            });
        });
}

// GET VILLAGES
export const getLocVillages = (district_id = null, regency_id = null, province_id = null, url = '/loc/village/') => dispatch => {
    if (district_id !== null) {
        url = url.concat(`?district_id=${district_id}`);
    } else if (regency_id !== null) {
        url = url.concat(`?regency_id=${regency_id}`);
    } else if (province_id !== null) {
        url = url.concat(`?province_id=${province_id}`);
    }

    axios
        .get(url)
        .then(res => {
            dispatch({
                type: GET_LOC_VILLAGE,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: {
                    msg: err.response.data,
                    status: err.response.status
                }
            });
        });
}
