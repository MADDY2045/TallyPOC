import React,{ useState,useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import dateformat from 'dateformat';
var validator = require("email-validator");


const App=()=>{
  const [id,setId] = useState('');
  const [firstname,setFirstName] = useState('');
  const [lastName,setLastName] = useState('');
  const [mobile,setMobile] = useState('');
  const [email,setEmail] = useState('');
  const [formFlag,setFormFlag] = useState(false);
  const [emailFlag,setEmailFlag] = useState(false);
  const [mobileFlag,setMobileFlag ] = useState(false)
  const [ createDate,setCreateDate ] = useState('');
  const [ userArray,setUserArray ] = useState([]);

  useEffect(()=>{
    console.log(`uuid is ${uuidv4()}`);
    setId(id);
  },[])

  useEffect(()=>{
    console.log('value changeg',firstname);
    console.log('value changeg',lastName);

  },[firstname,lastName]);

  let tempArray = [];
  const handleSubmit=()=>{

    let tempObj = {};
    tempObj.id = id;
    tempObj.firstname = firstname;
    tempObj.lastName = lastName;
    tempObj.mobile = mobile;
    tempObj.email = email;

    let createdDate = dateformat(new Date(),"dd/MM/yy");

    console.log(`created date is ${createdDate} `)
    tempObj.createdate = setCreateDate(createdDate);
    console.log(tempObj);
    validateFormValues(mobile,email);
    setTimeout(()=>{
      if(emailFlag && mobileFlag) {
        tempArray.push(tempObj);
        setUserArray([tempObj]);
        setFormFlag(true);
      }else{
        return alert("please enter mandatory fields");
      }
    },0)
  }

  const validateFormValues=(mobile,email)=>{
    setEmailFlag(validator.validate(email));
    if(mobile.length !== 10){
      return setMobileFlag(false)
    }else{
      setMobileFlag(true)
    };
  }
  return (
    <div className="container card">
       <button className="btn btn-primary mt-5" onClick={ handleSubmit }>Add</button>
      <div className="row">

          <div className="col-md-5">
            <label>FirstName</label>
              <input className="form-control" name="firstname" type="text" onChange={(e)=>setFirstName(e.target.value)}/>
          </div>
          <div className="col-md-5">
          <label>FirstName</label>
              <input className="form-control" name="lastname" type="text" onChange={(e)=>setLastName(e.target.value)}/>
          </div>
      </div>
      <div className="row">
          <div className="col-md-5">
            <label>Mobile</label>
              <input className="form-control" name="mobile" type="text" onChange={(e)=>setMobile(e.target.value)}/>
          </div>
          <div className="col-md-5">
          <label>Email</label>
              <input className="form-control" name="email" type="email" onChange={(e)=>setEmail(e.target.value)}/>
          </div>
      </div>
      { formFlag ? <div className="row">
        <div className="col-md-10">
          <div className="table table-responsive m-5">
          <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">Create Date</th>
                </tr>
              </thead>
              <tbody>
                { userArray && userArray.length>0 && userArray.map( item=>{
                    return(<tr key={item.id}>
                        <td>{`${item.firstname} ${item.lastName}`}</td>
                        <td>{item.email}</td>
                        <td>{item.mobile}</td>
                        <td>{item.createDate}</td>
                    </tr>)
                })}
                </tbody>
            </table>
          </div>
        </div>
      </div>:null}
    </div>
  )
}

export default App;
