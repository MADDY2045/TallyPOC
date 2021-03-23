import React from 'react'
import { Modal } from 'react-bootstrap';

const UserModal = (props)=>{
    return (
        <div>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form-group" onSubmit= { props.handleSubmit }>
                <div className="row">
                    <div className="col-md-6">
                    <label>FirstName</label>
                        <input className="form-control" name="firstname" type="text" value={props.firstname} onChange={ (e)=>props.handleChange('firstname',e.target.value)}/>
                    </div>
                    <div className="col-md-6">
                    <label>LastName</label>
                        <input className="form-control" name="lastname" type="text" value={props.lastName} onChange={(e)=>props.handleChange('lastname',e.target.value)}/>
                    </div>
                    </div>
                    <div className="row">
                    <div className="col-md-6">
                    <label>Mobile</label>
                        <input className="form-control" name="mobile" type="text" value={props.mobile} onChange={(e)=>props.handleChange('mobile',e.target.value)}/>
                    </div>
                    <div className="col-md-6">
                    <label>Email</label>
                        <input className="form-control" name="email" type="email" value={ props.email } onChange={(e)=>props.handleChange('email',e.target.value)}/>
                    </div>
                    </div>
                    <button type="submit" disabled = {!props.addUserButtonFlag} className="btn btn-primary m-4">
                        ADD
                    </button>
                    <button className="btn btn-outline-info m-4 pull-right" onClick={props.handleClose}>
                        Close
                    </button>
                    { !props.validMobile ? <small style={{ color:"red" }}>Please enter a valid mobile</small>:null}
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default UserModal
