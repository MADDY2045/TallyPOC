import React,{ useEffect } from 'react'

const CreateNewTemplate=(props)=>{

    useEffect(()=>{
        console.log('props are....',props);
    },[props])

    return (
        <div>
        { props.canShow ? <div className="container1 col-md-offset-9 col-md-9 text-center">
        <div className="row">
            <div className="col-md-offset-6 col-md-6 text-center">
                <h1 className='text-dark'>Create New Template</h1>
                <div className="form-login">

                    <select className="custom-select" id="inputGroupSelect01">
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
                    <input type="text" id="userPassword" className="form-control " placeholder="whatsapp_account_uid"/>
                    <input type="text" id="userName" className="form-control " placeholder="name"/>
                    <input type="text" id="userPassword" className="form-control " placeholder="language_code"/>
                    <input type="text" id="userName" className="form-control " placeholder="attachment"/>
                    <input type="text" id="userPassword" className="form-control " placeholder="text"/>
                    <div className="wrapper">
                            <span className="group-btn">
                                <button href="#" className="btn btn-danger btn-md">CREATE <i className="fa fa-sign-in"></i></button>
                            </span>
                    </div>
                </div>
            </div>
        </div>
    </div>:null}
       </div>
    )
}

export default CreateNewTemplate
