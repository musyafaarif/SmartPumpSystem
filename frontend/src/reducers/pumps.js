import { GET_PUMPS, DELETE_PUMP, CREATE_PUMP, EDIT_PUMP } from '../actions/types.js'

const initialState = {
    pumps: [],
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_PUMPS:
            return {
                ...state,
                pumps: action.payload
            };
        case DELETE_PUMP:
            return {
                ...state,
                pumps: state.pumps.filter(pump => 
                    Number(pump.id) !== Number(action.payload))
            };
        case CREATE_PUMP:
            return {
                ...state,
                pumps: [...state.pumps, action.payload],
                created_id: action.payload.id
            }
        case EDIT_PUMP:
            return {
                ...state,
                pumps: state.pumps.map(pump => action.payload.id == pump.id ? action.payload : pump)
            }
        default:
            return state;
    }
}
