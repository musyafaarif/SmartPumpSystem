import { combineReducers} from 'redux'
import systemhosts from './systemhosts'
import pumps from './pumps'
import locations from './locations'
import errors from './errors'
import messages from './messages'
import auth from './auth'

export default combineReducers({
    systemhosts,
    errors,
    messages,
    locations,
    auth,
    pumps,
});
