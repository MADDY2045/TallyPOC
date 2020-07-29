import React, { Component } from 'react';
import Home from '../src/components/Home';
import CancelFlow from '../src/components/CancelFlow';
import CreateTransaction from '../src/components/CreateTransaction';
import  './App.css';
import { Route,Switch } from 'react-router-dom';
import PayrollCreation from '../src/components/CreatePayroll';
class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/cancel' component={CancelFlow}/>
          <Route exact path='/create' component={CreateTransaction}/>
          <Route exact path='/createpayroll' component={PayrollCreation}/>
        </Switch>
      </div>
    );
  }
}

export default App;
