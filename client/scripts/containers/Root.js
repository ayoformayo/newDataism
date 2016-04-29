import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import AsyncApp from './AsyncApp'
import OnePager from './OnePager'
import { Router, Route, Link, DefaultRoute } from 'react-router'

const store = configureStore()

export default class Root extends Component {
  render() {
    const { history } = this.props;
    // <AsyncApp />
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route name='activity-feed' path="/:slug" component={OnePager}/>
          <Route name='activity-feed' path="*" component={OnePager}/>
        </Router>
      </Provider>
    )
  }
}
