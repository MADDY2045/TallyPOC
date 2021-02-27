import React,{ useEffect,useState } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import options from '../DropdownOptions';
const CreateNewTemplate=(props)=>{

    const [inputsValue, setValues] = useState({})

    const handleTemplateCreation =()=>{
        console.log(inputsValue);
        axios.post("http://localhost:7045/createtemplates",{inputsValue})
        .then(response=>{
            console.log(response.data);
            if(response.data.message === 'failure'){
                toast.error(`Failure!! ${response.data.data}`, {
                    position: toast.POSITION.TOP_RIGHT, autoClose:3000})
                }
            if(response.data.message === 'success'){
                toast.success("posted successfully");
            }
        })
        .catch(err=>console.log(err))
    }

    return (
        <div>
        { props.canShow && props.loggedIn ? <div className="container1 col-md-offset-9 col-md-9 text-center">
        <div className="row">
            <div className="col-md-offset-6 col-md-6 text-center">
                <h1 className='text-dark'>Create New Template</h1>
                <div className="form-login">
                    <select
                    onChange={(e)=>setValues({...inputsValue,[e.target.name]: e.target.value})}
                    className="custom-select" name="category" id="inputGroupSelect01">
                        { Object.keys(options).map( (item,index)=>{
                            return <option key = {index} value={item}>{options[item]}</option>
                        })}
                    </select>
                    <input
                   onChange={(e)=>setValues({...inputsValue,[e.target.name]: e.target.value})}
                    type="text"
                    id="userPassword"
                    className="form-control "
                    name="whatsapp_account_uid"
                    placeholder="whatsapp_account_uid"/>
                    <input
                   onChange={(e)=>setValues({...inputsValue,[e.target.name]: e.target.value})}
                    type="text"
                    id="userName"
                    className="form-control "
                    name="name"
                    placeholder="name"/>
                    <input
                   onChange={(e)=>setValues({...inputsValue,[e.target.name]: e.target.value})}
                    type="text"
                    id="userPassword"
                    className="form-control "
                    name="language_code"
                    placeholder="language_code"/>
                    <input
                   onChange={(e)=>setValues({...inputsValue,[e.target.name]: e.target.value})}
                    type="text"
                    id="userName"
                    className="form-control "
                    name="attachment"
                    placeholder="attachment"/>
                    <input
                   onChange={(e)=>setValues({...inputsValue,[e.target.name]: e.target.value})}
                    type="text"
                    id="userPassword"
                    className="form-control "
                    name="text"
                    placeholder="text"/>
                    <div className="wrapper">
                            <span className="group-btn">
                                <button onClick={ handleTemplateCreation } className="btn btn-danger btn-md">CREATE <i className="fa fa-sign-in"></i></button>
                            </span>
                    </div>
                </div>
            </div>
        </div>
    </div>:null}
    <ToastContainer />
       </div>
    )
}

export default CreateNewTemplate
