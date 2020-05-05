import axios from 'axios'

import { GET_PUMPS, DELETE_PUMP, CREATE_PUMP, EDIT_PUMP } from './types'
import { createMessage, returnErrors } from './messages'

// GET PUMPS
export const getPumps = (systemhost_id) => dispatch => {
    axios
        .get('/pumps/?format=json&host__id=' + systemhost_id)
        .then(res => {
            dispatch({
                type: GET_PUMPS,
                payload: res.data
            });
        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// DELETE PUMP
export const deletePump = (id) => (dispatch, getState) => {
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
        .delete(`/pumps/${id}/?format=json`, config)
        .then(res => {
            dispatch(createMessage({deletePump: `Pump ${id} deleted..`}));
            dispatch({
                type: DELETE_PUMP,
                payload: id
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
}

// CREATE PUMP
export const createPump = (systemhost_id) => (dispatch, getState) => {
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

    let today = new Date();
    console.log(today);
    
    const pump = {
        host: systemhost_id,
        last_maintenance_date: today,
    }

    axios
        .post('/pumps/', pump, config)
        .then(res => {
            dispatch({
                type: CREATE_PUMP,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status))
        });
};

// EDIT PUMP
export const editPump = (pump) => (dispatch, getState) => {
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
        .put('/pumps/' + pump.id + "/", pump, config)
        .then(res => {
            dispatch({
                type: EDIT_PUMP,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status))
        });
}
