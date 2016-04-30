import { combineReducers } from 'redux'
import {
  REQUEST_VIZ_DATA, RECEIVE_VIZ_DATA, SELECT_END_POINT, INVALIDATE_END_POINT
} from './actions'

// const initialState = {
//   visibilityFilter: VisibilityFilters.SHOW_ALL,
//   todos: []
// }

function selectedEndpoint(state = 'slack', action) {
  switch (action.type) {
  case RECEIVE_VIZ_DATA:
    return action.endPoint
  default:
    return state
  }
}

function dataPoints(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_END_POINT:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_VIZ_DATA:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_VIZ_DATA:
      let newState = {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
        items: action.dataPoints
      }
      return Object.assign({}, state, newState)
    default:
      return state
  }
}

function dataPointsByEndPoint(state = { }, action) {
  switch (action.type) {
    case INVALIDATE_END_POINT:
    case RECEIVE_VIZ_DATA:
    case REQUEST_VIZ_DATA:
      return Object.assign({}, state, {
        [action.endPoint]: dataPoints(state[action.endPoint], action)
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  dataPointsByEndPoint,
  selectedEndpoint
})

export default rootReducer;
