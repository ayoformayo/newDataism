import OnePager from "./ui/OnePager";
import Timer from "./ui/Timer";
import React from 'react'
import ReactDOM from "react-dom";
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory, DefaultRoute } from 'react-router'
const mountNode = document.getElementById("app");

class TodoList extends React.Component {
  render() {
    const createItem = (itemText) => {
      return <li>{itemText}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
}

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {items: [], text: ''};
  }

  onChange(e) {
    this.setState({text: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    var nextItems = this.state.items.concat([this.state.text]);
    var nextText = '';
    this.setState({items: nextItems, text: nextText});
  }

  render() {
    return (
      <div>
        <h3>TODO</h3>
        <TodoList items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
          <button>{'Add #' + (this.state.items.length + 1)}</button>
        </form>
        <Timer />
      </div>
    );
  }
}


// ReactDOM.render(<OnePager />, mountNode);
//
// var routes = (
//   <Route handler={Layout}>
//     <Route name='activity-feed' path="/:slug" handler={OnePager}/>
//   </Route>
// );

// var routes = (
//   <Route handler={Layout}>
//     <Route name='activity-feed' path="/?:slug?" handler={OnePager}/>
//     <Route name='default' path="/" handler={OnePager}/>
//   </Route>
// );

// <Route name='default' path="*" component={OnePager}/>
ReactDOM.render((
  <Router history={browserHistory}>
    <Route name='activity-feed' path="/:slug" component={OnePager}/>
    <Route name='activity-feed' path="*" component={OnePager}/>
  </Router>
), mountNode)

// Router.run(routes, Router.HistoryLocation, (Root) => {
//   React.render(<Root/>, mountNode);
// });
