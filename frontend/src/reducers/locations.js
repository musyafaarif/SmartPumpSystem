import { GET_LOC_PROVINCE, GET_LOC_REGENCY, GET_LOC_DISTRICT, GET_LOC_VILLAGE } from '../actions/types.js'

const initialState = {
    provinces: [],
    regencies: [],
    districts: [],
    villages: []
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_LOC_PROVINCE:
            return {
                ...state,
                provinces: action.payload,
                // regencies: [],
                // districts: [],
                // villages: []
            };
        case GET_LOC_REGENCY:
            return {
                ...state,
                regencies: action.payload,
                // districts: [],
                // villages: []
            };
        case GET_LOC_DISTRICT:
            return {
                ...state,
                districts: action.payload,
                // villages: []
            };
        case GET_LOC_VILLAGE:
            return {
                ...state,
                villages: action.payload
            };
        default:
            return state;
    }
}