import React, { Component } from 'react';
import Home from '../src/components/Home';
import CancelFlow from '../src/components/CancelFlow';
import  './App.css';
import { Route,Switch } from 'react-router-dom';
class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/cancel' component={CancelFlow}/>
        </Switch>
      </div>
    );
  }
}

export default App;
