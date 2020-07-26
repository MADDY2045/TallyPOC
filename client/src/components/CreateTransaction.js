import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class CreateTransaction extends Component {

    constructor(props){
        super(props)
        this.state={
            vouchertype:'',
            vouchernumber:'',
            tallyid:'',
            amount:'',
            date:''

        }
    }

    handleChange=(e)=>{
        e.preventDefault();
        //console.log(e.target.value);
        this.setState({
            [e.target.name]:e.target.value
          })
    }

    handleCreateDate=(date)=>{
       this.setState({date:date});
    }
    handleSubmit=(e)=>{
        console.log('date is ',this.state.date);
        console.log(this.state);
        e.preventDefault();
        axios({method:'POST',url:'http://localhost:5050/posttransaction',data:this.state}).then(res=>{
            console.log(res.data);
        }).catch(err=>console.log(err))
    }


    render() {
        return (
            <div className="container card" style={{margin:"50px auto",minHeight:"600px",background:"#d8d9da",width:"50%"}}>
                <h1 style={{margin:"10px auto"}}>GS APP</h1>
                <form onSubmit={this.handleSubmit}>
            <div className="form-row align-items-center">
                <div style={{width:"70%",position:"relative",left:"150px"}}>
                <select
                onChange={this.handleChange}
                value={this.state.vouchertype}
                name="vouchertype"
                className="custom-select mr-sm-2"
                id="inlineFormCustomSelect"
                style={{position:"relative",top:"50px"}}>
                    <option defaultValue>Choose Transaction</option>
                    <option value="Sales">Sales Invoice</option>
                    <option value="Purchase">Purchase Invoice</option>
                    <option value="Delivery Note">Delivery Note</option>
                    <option value="Receipt Note">Receipt Note</option>
                    <option value="Journal">Journal Voucher</option>
                    <option value="Receipt">Receipt Voucher</option>
                    <option value="Payment">Payment Voucher</option>
                    <option value="Credit Note">Credit Note</option>
                    <option value="Debit Note">Debit Note</option>
                    <option value="Stock Journal">Stock Journal</option>
                </select>
                </div >
                <div className="form-group " style={{width:"70%",position:"relative",left:"150px",top:"70px"}}>
                <label >Voucher Number</label>
                <input
                onChange={this.handleChange}
                name="vouchernumber"
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                required />
                </div>
                <div className="form-group" style={{width:"70%",position:"relative",left:"150px",top:"70px"}}>
                <label >Tally Id</label>
                <input
                onChange={this.handleChange}
                name="tallyid"
                type="number"
                className="form-control"
                id="formGroupExampleInput2"
                required />
                </div>
                <div className="form-group" style={{width:"70%",position:"relative",left:"150px",top:"80px"}}>
                <label >Amount</label>
                <input
                onChange={this.handleChange}
                name="amount"
                type="number"
                className="form-control"
                id="formGroupExampleInput2"
                required />
                </div>
                <div className="form-group" style={{width:"70%",position:"relative",left:"150px",top:"80px"}}>
                <label >Date</label>

                <DatePicker
                    className="form-control ml-3 mt-2"
                    selected={this.state.date}
                    onChange={this.handleCreateDate}
                />
                </div>
            </div>
            <button type="submit" style={{width:'200px',position:"relative",top:"80px",left:"320px"}} className="btn btn-primary">SUBMIT</button>
           </form>
          </div>
        )
    }
}

export default CreateTransaction;