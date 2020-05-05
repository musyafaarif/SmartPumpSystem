import axios from 'axios'

import { GET_SYSTEM_HOSTS, GET_SYSTEM_HOST, DELETE_SYSTEM_HOST, CREATE_SYSTEM_HOST, GET_ERRORS, EDIT_SYSTEM_HOST, SELECT_SYSTEM_HOST } from './types'
import { createMessage, returnErrors } from './messages'

// GET SYSTEM HOSTS
export const getSystemHosts = (page = 1) => dispatch => {
    axios
        .get('/hosts/?format=json&page=' + page)
        .then(res => {
            dispatch({
                type: GET_SYSTEM_HOSTS,
                payload: res.data
            });
        })
        .catch(err => {
            console.log(err);
            
            dispatch(returnErrors(err.response.data, err.response.status));
        });
};

// DELETE SYSTEM HOST
export const deleteSystemHost = (id) => (dispatch, getState) => {
    // Get Token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // If token, add to headers config
    if(token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    axios
        .delete(`/hosts/${id}/?format=json`, config)
        .then(res => {
            dispatch(createMessage({deleteSystemHost: `System Host ${id} deleted..`}));
            dispatch({
                type: DELETE_SYSTEM_HOST,
                payload: id
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
}

// ADD SYSTEM HOST
export const createSystemHost = (systemhost) => (dispatch, getState) => {
    // Get Token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // If token, add to headers config
    if(token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    axios
        .post('/hosts/', systemhost, config)
        .then(res => {
            dispatch({
                type: CREATE_SYSTEM_HOST,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status))
        });
};


// EDIT SYSTEM HOST
export const editSystemHost = (systemhost) => (dispatch, getState) => {
    // Get Token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // If token, add to headers config
    if(token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    axios
        .put('/hosts/' + systemhost.id + "/", systemhost, config)
        .then(res => {
            dispatch({
                type: EDIT_SYSTEM_HOST,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status))
        });
}

// SELECT SYSTEM HOST
export const selectSystemHost = (systemhost_id) => dispatch => {
    dispatch({
        type: SELECT_SYSTEM_HOST,
        payload: Number(systemhost_id),
    })
}

export function getName(systemhost, max_length = null) {
    const suffix = "...";

    name = (
        systemhost.province_name + 
        ( systemhost.regency_name ? "_" + systemhost.regency_name : "") + 
        ( systemhost.district_name ? "_" + systemhost.district_name : "") + 
        ( systemhost.village_name ? "_" + systemhost.village_name : "")
    );

    if (max_length && name.length > max_length) {
        name = name.substring(0, max_length - 3);
        name = name + suffix;
    }

    return name;
}
