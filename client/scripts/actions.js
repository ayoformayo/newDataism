import fetch from 'isomorphic-fetch'

export const REQUEST_VIZ_DATA = 'REQUEST_VIZ_DATA'
export const RECEIVE_VIZ_DATA = 'RECEIVE_VIZ_DATA'
export const SELECT_END_POINT = 'SELECT_END_POINT'
export const INVALIDATE_END_POINT = 'INVALIDATE_END_POINT'

export function selectEndPoint(endPoint) {
  return {
    type: SELECT_SUBREDDIT,
    endPoint
  }
}

export function invalidateEndPoint(endPoint) {
  return {
    type: INVALIDATE_SUBREDDIT,
    endPoint
  }
}

function requestVizData(endPoint) {
  return {
    type: REQUEST_VIZ_DATA,
    endPoint
  }
}

function receiveVizData(endPoint, json) {
  return {
    type: RECEIVE_VIZ_DATA,
    endPoint,
    // dataPoints: json.data.children.map(child => child.data),
    dataPoints: json,
    receivedAt: Date.now()
  }
}

function fetchVizData(endPoint) {
  return dispatch => {
    dispatch(requestVizData(endPoint))
    return fetch(`/${endPoint}.json`)
      .then(response => response.json())
      .then(json => dispatch(receiveVizData(endPoint, json)))
  }
}

function shouldFetchVizData(state, endPoint) {
  const newEndPoint = state.dataPointsByEndPoint[endPoint]
  if (!newEndPoint) {
    return true
  } else if (newEndPoint.isFetching) {
    return false
  } else {
    return newEndPoint.didInvalidate
  }
}

export function fetchVizDataIfNeeded(endPoint) {
  return (dispatch, getState) => {
    if (shouldFetchVizData(getState(), endPoint)) {
      return dispatch(fetchVizData(endPoint))
    }
  }
}
