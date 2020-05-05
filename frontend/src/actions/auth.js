import axios from 'axios'
import { returnErrors } from "./messages";

import { 
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL
 } from "./types";

 // CHECK TOKEN & LOAD USER
 export const loadUser = () => (dispatch, getState) => {
     // User Loading
     dispatch({ type: USER_LOADING });

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

     axios.get('api/auth/user', config)
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        });
 };

 // LOGIN USER
 export const login = (username, password) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // Request Body
    const body = JSON.stringify({username, password});

    axios
        .post('api/auth/login', body, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: LOGIN_FAIL
            });
        });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {

     // Get Token from state
     const token = getState().auth.token;

     // If token, add to headers config
     if(token) {
        // Headers
        const config = {
            headers: {
                'Authorization': `Token ${token}`
            }
        };

        axios
            .post('api/auth/logout', null, config)
            .then(res => {
                dispatch({
                    type: LOGOUT_SUCCESS,
                })
            })
            .catch(err => {
                dispatch(returnErrors(err.response.data, err.response.status));
                dispatch({
                    type: LOGOUT_FAIL
                })
            });
     } else {
         dispatch(returnErrors('Not logged in', 404));
     };
}