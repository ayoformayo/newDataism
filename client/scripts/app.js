// import OnePager from "./containers/OnePager";
import React from 'react'
import ReactDOM from "react-dom";
import { render } from 'react-dom'
import Root from './containers/Root'
import {browserHistory} from 'react-router'
const mountNode = document.getElementById("app");

// ReactDOM.render((
//   <Router history={browserHistory}>
//     <Route name='activity-feed' path="/:slug" component={OnePager}/>
//     <Route name='activity-feed' path="*" component={OnePager}/>
//   </Router>
// ), mountNode)

render(
  <Root history={browserHistory}/>,
  mountNode
)
