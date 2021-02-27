import React,{ useState,useEffect } from 'react'
import axios from 'axios';

const Navbar=(props)=>{

const [sid,setSid] = useState('');
const [ token,setToken ] = useState('');
const [ email,setEmail ] = useState('');
const [ classtype,setClassType ] = useState('nav-link active');

const handleSubmit =()=>{
    console.log(`sid is ${sid}`);
    console.log(`token is ${token}`);
    let data = {sid,token,email }

    axios.post('http://localhost:7045/setcredentials',data)
    .then(response=>{
        console.log(response.data);
    })
    .catch(err=>console.log(err))
}

useEffect(()=>{
    setSid('');
    setToken('');
    if(props.loggedIn){
        setClassType('nav-link');
    }else{
        setClassType('nav-link active');
    }
},[props.loggedIn])

useEffect(()=>{
    if(props.useremail.length>0){
        setEmail(props.useremail)
    }
},[props.useremail])



    return (
        <div className="main">
            <nav className="navbar navbar-expand-lg navbar-dark bg-info">
                <ul className="nav navbar-nav navbar-center">
                <li className="nav-item dropdown ">
                    <span className="nav-link text-white"  id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {props.loggedIn ? 'Menu':null}
                    </span>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <span onClick={ props.createNewTemplate } className="dropdown-item" >Create New</span>
                        <span onClick={ props.listAllTemplates } className="dropdown-item" >List All Templates</span>
                        <span onClick={ props.getStatus } className="dropdown-item" >Get Templates by id</span>
                    </div>
                </li>
                <li className="nav-item">
                    <span className="nav-link" data-toggle="modal" data-target="#exampleModalCenter">{props.loggedIn ? 'Set Credentials':null}</span>
                </li>
                <li className="nav-item">
                    <span onClick={ props.signIn } className={ classtype } style={{visibility:props.loggedIn ? 'hidden':'visible'}}>{props.loggedIn ? 'Logged In':'Login'}</span>
                </li>
                <li className="nav-item">
                    <span onClick={ props.signOut } className="nav-link">{props.loggedIn ? 'Log out':null}</span>
                </li>
                </ul>
                <ul className="nav navbar-nav ml-auto" >
                    <li className="nav-item" style={{color:"white",margin: "5px 10px"}}>{ props.userName.length > 0 ? `welcome! ${props.userName}`:null}</li>
                    <li className="nav-item">{ props.imageUrl.length > 0 ? <img style={{borderRadius:"100%",width: "36px"}} src={props.imageUrl} alt="test"/>:null}</li>
                </ul>
            </nav>
            <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <form>
      {/* <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
            onChange={ (e)=>setEmail(e.target.value)}
            value={ email }
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"/>
        </div> */}
        <div className="form-group">
            <label htmlFor="sid">SID</label>
            <input
            onChange={ (e)=>setSid(e.target.value)}
            value={ sid }
            type="text"
            name="accountsid"
            id="sid"
            placeholder="Enter your account SID"/>
        </div>
        <div className="form-group">
            <label>Token</label>
            <input
            onChange={ (e)=>setToken(e.target.value)}
            value={ token }
            type="text"
            name="accounttoken"
            id="token"
            placeholder="Enter your token"/>
        </div>
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button onClick={ handleSubmit } type="button" className="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
</div>
</div>
    )
}

export default Navbar;