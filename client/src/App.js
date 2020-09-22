import React, { Component } from 'react';
import Home from '../src/components/Home';
import  './App.css';
import KarixHome from '../src/components/KarixHome';
import Navbar from '../src/components/Navbar';
import { Route,Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <Navbar/>
        <Switch>
          {/* <Route exact path='/' component={Home}/> */}
          <Route exact path='/' component={KarixHome}/>
        </Switch>
      </div>
    );
  }
}

export default App;
