import { GET_SYSTEM_HOSTS, GET_SYSTEM_HOST, DELETE_SYSTEM_HOST, CREATE_SYSTEM_HOST, EDIT_SYSTEM_HOST, SELECT_SYSTEM_HOST } from '../actions/types.js';
import { getSystemHosts } from '../actions/systemhosts'

const initialState = {
    count: 0,
    next: null,
    prev: null,
    systemhosts: [],
    selected_systemhost_id: null,
    need_update: false,
};

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_SYSTEM_HOSTS:
            var selected_systemhost_id = state.selected_systemhost_id;
            if (selected_systemhost_id && (action.payload.results.find(({id}) => id === selected_systemhost_id) === undefined)) {
                selected_systemhost_id = null;
            }

            return {
                ...state,
                count: action.payload.count,
                next: action.payload.next,
                prev: action.payload.previous,
                systemhosts: action.payload.results,
                selected_systemhost_id: selected_systemhost_id,
                need_update: false,
            };
        case DELETE_SYSTEM_HOST:
            var selected_systemhost_id = state.selected_systemhost_id;
            if (selected_systemhost_id && selected_systemhost_id === Number(action.payload)) {
                selected_systemhost_id = null;
            }

            return {
                ...state,
                selected_systemhost_id: selected_systemhost_id,
                need_update: true,
            };
        case CREATE_SYSTEM_HOST:
            return {
                ...state,
                systemhosts: [...state.systemhosts, action.payload],
                created_id: action.payload.id,
                need_update: true,
            };
        case EDIT_SYSTEM_HOST:
            return {
                ...state,
                systemhosts: state.systemhosts.map(systemhost => action.payload.id === systemhost.id ? action.payload : systemhost),
                need_update: true,
            };
        case SELECT_SYSTEM_HOST:
            return {
                ...state,
                selected_systemhost_id: action.payload,
            };
        default:
            return state;
    };
};
