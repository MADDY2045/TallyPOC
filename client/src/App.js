import React,{ useState,useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import UserModal from './components/UserModal';
import './App.css';
import dateformat from 'dateformat';

const App=()=>{
  const [id,setId] = useState(uuidv4());
  const [firstname,setFirstName] = useState('');
  const [lastName,setLastName] = useState('');
  const [mobile,setMobile] = useState('');
  const [email,setEmail] = useState('');
  const [formFlag,setFormFlag] = useState(false);
  const [validMobile,setValidMobile ] = useState(true)
  const [ createDate,setCreateDate ] = useState(dateformat(new Date(),"dd/mm/yyyy"));
  const [ userArray,setUserArray ] = useState([]);
  const [ addUserButtonFlag,setAddUserButtonFlag ] = useState(false)

  //modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(()=>{
    if(!firstname || !lastName || !mobile || !email){
      setAddUserButtonFlag(false);
    }else{
      setAddUserButtonFlag(true);
    }
  },[firstname,lastName,mobile,email]);

  const handleSubmit=(e)=>{
    e.preventDefault();
    let tempArray = [];
    let tempObj = {};
    console.log("...........submitted.........");
    let createdDate = dateformat(new Date(),"dd/mm/yyyy");
    setCreateDate(createdDate);
    var pattern=/^(0|[+91]{3})?[7-9][0-9]{9}$/;
    if(!pattern.test(mobile)) setValidMobile(false);
    else{

      setId(uuidv4());
      tempObj.id = id;
      tempObj.createdate = createDate;
      tempObj.firstname = firstname;
      tempObj.lastName = lastName;
      tempObj.mobile = mobile;
      tempObj.email = email;
      console.log(tempObj);
      tempArray.push(tempObj);
      //console.log('temparray is ...',tempArray)
      setUserArray([...userArray,...tempArray]);
      setFormFlag(true);
      setShow(false);
    }
  }

   const handleChange=(param,value)=>{
    switch(param){
      case 'firstname':
        setFirstName(value);
        break;
      case 'lastname':
        setLastName(value);
        break;
      case 'mobile':
        setValidMobile(true);
        setMobile(value);
        break;
      case 'email':
        setEmail(value);
        break;
      default:
        break;
    }
  }

  const callTablebody = ()=>{
    if(userArray.length > 0){
      console.log('inside function...',userArray)
      return userArray.map( (item,index)=>{
        return(<tr key={index}>
            <td>{item.firstname}</td>
            <td>{item.email}</td>
            <td>{item.mobile}</td>
            <td>{item.createdate}</td>
        </tr>)
    })
    }else{
      return;
    }
  }

  return (
    <div className="container card">
      <div className="text-right mr-5">
       <button className="btn btn-primary mt-5 col-md-2" onClick={ ()=>setShow(true) }>Add User</button>
      </div>
      { formFlag || userArray.length > 0 ? <div className="row">
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
                {callTablebody()}
              </tbody>
            </table>
          </div>
        </div>
      </div>:null}
      <UserModal
      show={ show }
      validMobile = { validMobile }
      addUserButtonFlag = { addUserButtonFlag }
      handleClose={ handleClose }
      handleShow={ handleShow }
      handleChange={ handleChange }
      handleSubmit={ handleSubmit } />
    </div>
  )
}

export default App;
