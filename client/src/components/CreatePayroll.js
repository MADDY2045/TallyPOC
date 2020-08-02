import React, { Component } from 'react'
import '../App.css';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

let tempArr = [];
class CreatePayroll extends Component {

    constructor(props){
        super(props);
        this.state={
            name:'',
            role:'',
            id:'',
            payhead:[],
            date:new Date(),
            transactiontype:'',
            account:'',
            instrumentnumber:'',
            instrumentdate:'',
            ifsc:'',
            txntypeflag:false,
            payheadamount:'',
            payheadvalue:''

        }
    }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleCreateDate=(date)=>{
        this.setState({
            date:date
        })
    }
    handleSubmit=()=>{
        console.log(this.state);
        axios.post("http://localhost:5050/createemployeesalary",{data:this.state}).then(response=>{
            console.log(response.data);
        }).catch(err=>console.log(err))
    }

    handleTransactionChange=(e)=>{

        this.setState({
            txntypeflag:e.target.value==='Cash'? false : true,
            transactiontype:e.target.value
        })
    }

    handlePayheadChange=(e)=>{
        this.setState({
                [e.target.name]:e.target.value
            })
        }

    handlePayHead=(e)=>{
        e.preventDefault();
        let tempObj={};

        if(this.state.payheadvalue!=='' && this.state.payheadvalue!==undefined && this.state.payheadvalue!==null && this.state.payheadamount!=='' && this.state.payheadamount!==undefined && this.state.payheadamount!==null ){
            tempObj[this.state.payheadvalue]=this.state.payheadamount;
            tempArr.push(tempObj)
            this.setState({
                payhead:tempArr
            })
        }
    }

    handlePayheadDelete=(element,item)=>{
        this.state.payhead.splice(this.state.payhead.findIndex(item => Object.keys(item)[0] === element), 1)
        console.log(this.state.payhead);
        this.setState({
            payhead:this.state.payhead
        })
    }

    render() {

        return (
            <div>
               <div className="row" style={{minHeight:"800px"}} >
                    <div className="col-md-8 card row" style={{margin:"30px auto"}}>
                        <div className="row">
                        <div className="col-md-8 card" style={{minHeight:"740px"}}>
                        <form >
            <div >

                <div className="form-group " >
                <label style={{position:"relative",width:"200px",left:"50px",top:"40px"}}>Name</label>
                <input
                onChange={this.handleChange}
                name="name"
                type="text"
                className="form-control"
                style={{position:"relative",width:"250px",left:"180px"}}
                />
                </div>
                <div className="form-group" >
                <label style={{position:"relative",width:"200px",left:"50px",top:"40px"}}>ID</label>
                <input
                onChange={this.handleChange}
                name="id"
                type="number"
                className="form-control"
                style={{position:"relative",width:"250px",left:"180px"}}
                />
                </div>
                <div className="form-group" >
                <label style={{position:"relative",width:"200px",left:"50px",top:"40px"}}>ROLE</label>
                <select
                 style={{position:"relative",width:"250px",left:"-20px",top:"30px"}}
                 onChange={this.handleChange}
                 name="role"
                className="custom-select mr-sm-2"
               >
                    <option defaultValue>Choose Role</option>
                    <option value="Manager">Manager</option>
                    <option value="Programmer">Programmer</option>
                    <option value="HR">HR</option>
                    <option value="Director">Director</option>
                </select>
                </div>
                <div className="form-group" style={{position:"relative",width:"250px",left:"133px",top:"20px"}} >
                <label style={{position:"relative",width:"200px",left:"-85px",top:"40px"}}>Date</label>
                <DatePicker
                   className="form-control ml-5"
                    selected={this.state.date}
                    onChange={this.handleCreateDate}
                />
                </div>
                <label style={{position:"relative",width:"200px",left:"50px",top:"40px"}}>Payhead</label>
                <select
                style={{position:"relative",width:"100px",left:"-20px",top:"38px"}}
                onChange={this.handlePayheadChange}
                name="payheadvalue"
                className="custom-select mr-sm-2"
               >
                    <option defaultValue>Choose Transaction</option>
                    <option value="Basic Pay">Basic Pay</option>
                    <option value="DA">DA</option>
                    <option value="HRA">HRA</option>
                    <option value="TA">TA</option>
                    <option value="Medical Allowance">Medical Allowance</option>
                    <option value="PF">PF</option>
                    <option value="IT">IT</option>
                    <option value="Loans">Loans</option>
                    <option value="Salary Advance">Salary Advance</option>

                </select>
                <button
                onClick={this.handlePayHead}
                style={{position:"relative",width:"100px",left:"120px",top:"38px"}} className="btn btn-success">ADD</button>
                <input
                onChange={this.handlePayheadChange}
                name="payheadamount"
                type="number"
                className="form-control"
                style={{position:"relative",width:"150px",left:"280px",top:"-10px"}}
                />
            </div>
            <label style={{position:"relative",width:"200px",left:"50px",top:"40px"}}>Transaction Type</label>
                <select
                style={{position:"relative",width:"100px",left:"-20px",top:"38px"}}
                onChange={this.handleTransactionChange}
                value={this.state.transactiontype}
                name="vouchertype"
                className="custom-select mr-sm-2"
               >
                    <option defaultValue>Choose Transaction</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                </select>
                {this.state.txntypeflag ?
                <div className="row" id="transactiontype">
                <div className="col-md-6" style={{minHeight:"280px",maxHeight:"280px",position:"absolute",left:"300px",top:"430px"}}>
                <div className="form-group " >
                <label style={{position:"relative",width:"200px",left:"0px",top:"40px",fontSize:"14px"}}>ACCOUNT</label>
                <input
                onChange={this.handleChange}
                name="account"
                type="text"
                className="form-control"
                style={{position:"relative",width:"200px",left:"80px"}}
                />
                </div>
                <div className="form-group " >
                <label style={{position:"relative",width:"200px",left:"0px",top:"20px",fontSize:"14px"}}>IFSC</label>
                <input
                onChange={this.handleChange}
                name="ifsc"
                type="text"
                className="form-control"
                style={{position:"relative",width:"200px",left:"80px",top:"-18px"}}
                />
                </div>
                <div className="form-group " >
                <label style={{position:"relative",width:"200px",left:"0px",top:"10px",fontSize:"14px"}}>INSTR NO</label>
                <input
                onChange={this.handleChange}
                name="instrumentnumber"
                type="text"
                className="form-control"
                style={{position:"relative",width:"200px",left:"80px",top:"-28px"}}
                />
                </div>
                <div className="form-group " >
                <label style={{position:"relative",width:"200px",left:"0px",top:"-8px",fontSize:"14px"}}>DATE</label>
                <input
                onChange={this.handleChange}
                name="instrumentdate"
                type="text"
                className="form-control"
                style={{position:"relative",width:"200px",left:"80px",top:"-44px"}}
                />
                </div>
                </div>
            </div>
                :null}


           </form>
           <button
           onClick={this.handleSubmit}
           style={{position:"absolute",top:"650px",left:"180px"}} className="btn btn-primary">SUBMIT</button>
                    </div>
                    <div className="col-md-4 card" style={{minHeight:"740px"}}>
                        {this.state.payhead.length>0 ? <div>
                            {this.state.payhead.map((item,index)=>{
                                return Object.keys(item).map(element=>{
                                return <ul key={index}><li key={item}>{`${element}<--->${item[element]}`}<button
                                onClick={()=>this.handlePayheadDelete(element,item[element])}
                                className="btn btn-danger">Delete</button></li></ul>
                                })
                            })}
                        </div>:null}
                    </div>
                        </div>

                    </div>
               </div>
            </div>
        )
    }
}

export default React.memo(CreatePayroll);
