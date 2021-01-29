import React,{ useEffect,useState } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateNewTemplate=(props)=>{

    const [inputsValue, setValues] = useState({})

    useEffect(()=>{
        console.log('props are....',props);
    },[props])

    // const inputOnChange=(event)=>{
    //     const { name, value } = event.target
    //     setValues({
    //         ...inputsValue,
    //         [name]: value
    //     })
    // }

    const handleTemplateCreation =()=>{
        console.log(inputsValue);
        axios.post("http://localhost:7045/createtemplates",{inputsValue})
        .then(response=>{
            console.log(response.data);
            if(response.data.message === 'failure'){
                toast.error(`Failure!! ${response.data.data}`, {
                    // Set to 15sec
                    position: toast.POSITION.TOP_RIGHT, autoClose:3000})
                //toast.warning(`Failure!! ${response.data.data}`);
            }
            if(response.data.message === 'success'){
                toast.success("posted successfully");
            }
        })
        .catch(err=>console.log(err))
    }

    return (
        <div>
        { props.canShow ? <div className="container1 col-md-offset-9 col-md-9 text-center">
        <div className="row">
            <div className="col-md-offset-6 col-md-6 text-center">
                <h1 className='text-dark'>Create New Template</h1>
                <div className="form-login">
                    <select
                    onChange={(e)=>setValues({...inputsValue,[e.target.name]: e.target.value})}
                    className="custom-select" name="category" id="inputGroupSelect01">
                        <option defaultValue>Choose Category</option>
                        <option value="account_update">Account Update</option>
                        <option value="payment_update">Payment Update</option>
                        <option value="personal_finance_update">Personal Finance Update</option>
                        <option value="shipping_update">Shipping Update</option>
                        <option value="reservation_update">Reservation Update</option>
                        <option value="issue_resolution">Issue Resolution</option>
                        <option value="appointment_update">Appointment Update</option>
                        <option value="transportation_update">Transportation Update</option>
                        <option value="ticket_update">Ticket Update</option>
                        <option value="alert_update">Alert Update</option>
                        <option value="auto_reply">Auto Reply</option>
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
