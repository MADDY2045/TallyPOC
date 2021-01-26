import React,{ useState } from 'react';
import  './App.css';
import Navbar from './components/Navbar';
import Content from './components/Content';
// eslint-disable-next-line
import { Route,Switch } from 'react-router-dom';

const App =()=> {

  const [ createNew,setCreateNew ] = useState(false);

  const createNewTemplate=()=>{
    setCreateNew(true);
  }
    return (
      <div>
        <Navbar createNewTemplate={createNewTemplate} />
        <Content style={{ opacity:0.2 }} createNew={createNew}/>
      </div>
    );

}

export default App;
