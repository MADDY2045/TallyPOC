import React,{ useState } from 'react';
import  './App.css';
import Navbar from './components/Navbar';
import Content from './components/Content';
// eslint-disable-next-line
import { Route,Switch } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin,useGoogleLogout } from 'react-google-login';

const clientId = '485008776010-mj3o94klbaj6kq2885u72lft8v999p7s.apps.googleusercontent.com';

const App =()=> {

  const [ createNew,setCreateNew ] = useState(false);
  const [loggedIn,setLoggedIn] = useState(false);
  const [ useremail,setUserEmail ] = useState('')

  const onSuccess = async (res)=>{
    var reloadResponse = await res.reloadAuthResponse();
    let refreshTiming = (res.tokenObj.expires_in || 3600-5 *60) * 1000;
    const refreshToken= async()=>{
      const newAuthRes = await res.reloadAuthResponse();
      refreshTiming = (newAuthRes.expires_in || 3600-5 * 60) * 1000;
      console.log(`newAuthRes: ${JSON.stringify(newAuthRes,null,2)}`);
      setTimeout(refreshToken,refreshTiming);
    }
    setTimeout(refreshToken,refreshTiming);
    axios.post('http://localhost:7045/handleuser',{data:reloadResponse.id_token})
    .then(response=>{
        console.log(response.data);
        if(response.data.userId){
            setLoggedIn(true);
            setUserEmail(response.data.email)
        }
    })
    .catch(err=>console.log(`error in handling token id ${err}`))
  }

  const onFailure = (res)=>{
    console.log(`Login failed!! ${JSON.stringify(res,null,2)}`);
  }

  const onLogoutSuccess = ()=>{
    console.log(`Logged out successfully!! `);
    setLoggedIn(false);
  }

  const { signIn } = useGoogleLogin({
      onSuccess,
      onFailure,
      clientId,
      isSignedIn:true,
      accessType:'offline'
  })


  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure
   })

  const createNewTemplate=()=>{
    setCreateNew(true);
  }
    return (
      <div>
        <Navbar signIn={ signIn } signOut={ signOut } useremail={ useremail }  loggedIn={ loggedIn } createNewTemplate={createNewTemplate} />
        <Content style={{ opacity:0.2 }} useremail={ useremail } createNew={createNew} loggedIn={ loggedIn }/>
      </div>
    );

}

export default App;
