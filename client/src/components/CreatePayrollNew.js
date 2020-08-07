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
            payheadvalue:'',
            manualmode:false,
            computedmode:true,
            present:0,
            leave:0,
            overtime:0,
            basicpay:0,
            ta:0,
            hra:0,
            medicalallowance:0,
            da:0,
            loans:0,
            pf:0,
            it:0,
            salaryadvance:0,
            errordayscount:false,
            computetableflag:false
        }
    }



    handlePayrollManualView=()=>{
        this.setState({
            manualmode:!this.state.manualmode,
            computedmode:!this.state.computedmode
        })
    }
    handlePayrollComputedView=()=>{
        this.setState({
            computedmode:!this.state.computedmode,
            manualmode:!this.state.manualmode
        })
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

    handleCompute=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
        // console.log(e.target.value);
    }

    handleComputeSubmit=()=>{
        this.setState({
            computetableflag:true
        })
        let { present,leave,basicpay,da,ta,hra,medicalallowance,loans,salaryadvance,it,pf } = this.state;
        this.setState({
            payhead:[]
        })

        let netdays = 0;
        netdays = Number(present)+Number(leave);
        console.log(netdays);
        if(netdays > 30 || netdays===0){
            this.setState({
                errordayscount:true
            })
        }else{
            this.setState({
                errordayscount:false
            })
            let tempobj = {};
            let assigningobject ={}
            let temppayheadarray =[];
            let assigningarray = [];
            console.log("can be approved");

            let basiccalculatedpay = Math.round((basicpay*present)/30);
            tempobj["Basic Pay"]=basiccalculatedpay
            let calculatedda = Math.round((basiccalculatedpay*da)/100);
            tempobj["DA"]=calculatedda;
            let calculatedhra = Math.round((basiccalculatedpay*hra)/100);
            tempobj["HRA"]=calculatedhra;
            tempobj["TA"]=ta;
            tempobj["Medical Allowance"]=medicalallowance;
            tempobj["PF"]=Math.round((basiccalculatedpay*pf)/100);
            tempobj["IT"]=Math.round((basiccalculatedpay*it)/100);
            tempobj["Loans"]=loans;
            tempobj["Salary Advance"]=salaryadvance;
            temppayheadarray.push(tempobj);
            console.log('temppayheadarray',temppayheadarray);
            Object.keys(temppayheadarray[0]).map(eachkey=>{
                console.log('eachkey::',eachkey);
                assigningobject={};
                assigningobject[eachkey]= temppayheadarray[0][eachkey];
                assigningarray.push(assigningobject);
            })

            console.log('assigningarray',assigningarray);
            setTimeout(() => {
                console.log('thisstate',this.state);
            }, 100);
            this.setState({
                payhead:assigningarray
            })

        }

    }
    render() {

        return (
            <div className="card row " style={{width:"98%",margin:"20px auto",minHeight:"700px"}}>
                   <div className="col-md-12">
                    <button onClick={this.handlePayrollManualView} className="btn btn-secondary" disabled={this.state.manualmode}>Manual</button>
                    <button onClick={this.handlePayrollComputedView} className="btn btn-info" disabled={this.state.computedmode}>Computed</button>
                </div>
                {this.state.manualmode ?
                <div className="row">
                   <div className="col-md-10 card row" style={{margin:"30px auto"}}>
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
                </div>:
            //    { /* start of computed */ }
                <div className="row" style={{overflow:"hidden"}}>
                    <div className="col-md-12" style={{minHeight:"200px",border: '1px solid grey',maxWidth:"97%",position:"relative",left:"22px"}}>
                    <div className="form-group " >
                        <label id="namelabel">Name</label>
                        <input onChange={this.handleChange} type="text" name="name" className="form-control" id="name" />
                    </div>
                    <div className="form-group " >
                        <label id="idlabel">ID</label>
                        <input onChange={this.handleChange} type="text" name="id" className="form-control" id="id" />
                    </div>
                    <div className="form-group" >
                    <label id="rolelabel">ROLE</label>
                    <select
                    id="selectrole"
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
                    <div className="form-group"  id="datepicker">
                        <label id="datelabel">Date</label>
                        <DatePicker
                        className="form-control ml-5"
                        selected={this.state.date}
                        onChange={this.handleCreateDate}
                        />
                        </div>
                       <div>
                       <label id="transactiontypelabel">Transaction Type</label>
                            <select
                            id="selecttransactiontype"
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
                            <div className="row" >
                            <div >
                            <div className="form-group " >
                            <label id="accountlabel">ACCOUNT</label>
                            <input
                            id="account"
                            onChange={this.handleChange}
                            name="account"
                            type="text"
                            className="form-control"
                            />
                            </div>
                            <div className="form-group " >
                            <label id="ifsclabel">IFSC</label>
                            <input
                            id="ifsc"
                            onChange={this.handleChange}
                            name="ifsc"
                            type="text"
                            className="form-control"
                            />
                            </div>
                            <div className="form-group " >
                            <label id="instrnolabel">INSTR NO</label>
                            <input
                            id="instrno"
                            onChange={this.handleChange}
                            name="instrumentnumber"
                            type="text"
                            className="form-control"
                            />
                            </div>
                            <div className="form-group " >
                            <label id="bankdatelabel">DATE</label>
                            <input
                            id="bankdate"
                            onChange={this.handleChange}
                            name="instrumentdate"
                            type="text"
                            className="form-control"
                            />
                            </div>
                            </div>
                            </div>
                            :null}
                        </div>
                    </div>
                    <div className="col-md-12" style={{minHeight:"200px",maxHeight:"200px",border: '1px solid grey',maxWidth:"97%",position:"relative",left:"22px"}}>
                           <h4>Attendance Details</h4>
                           <small style={{position:"absolute",left:"250px"}}>{this.state.errordayscount ? <div>Please validate days</div>:null}</small>
                           <div className="row">
                               <div className="col-md-6">
                               <div className="form-group " >
                                <label id="presentlabel">Present</label>
                                <input onChange={this.handleCompute} type="number" name="present" className="form-control" id="present" required max="30"/>
                                </div>
                                <div className="form-group " >
                                <label id="leavelabel">Leave</label>
                                <input onChange={this.handleCompute} type="number" name="leave" className="form-control" id="leave" required max="30"/>
                                </div>

                                <div className="form-group " >
                                <label id="overtimelabel">Overtime</label>
                                <input onChange={this.handleCompute} type="number" name="overtime" className="form-control" id="overtime" required max="8"/>
                                </div>
                               </div>
                               <div className="col-md-6">
                               <div className="form-group " >
                                <label id="basicpaylabel">Basic Pay</label>
                                <input onChange={this.handleCompute} type="number" name="basicpay" className="form-control" id="basicpay" required />
                                </div>
                                <div className="form-group " >
                                <label id="dalabel">DA</label>
                                <input onChange={this.handleCompute} type="number" name="da" className="form-control" id="da"  max="100" placeholder="%"/>
                                </div>

                                <div className="form-group " >
                                <label id="hralabel">HRA</label>
                                <input onChange={this.handleCompute} type="number" name="hra" className="form-control" id="hra"  max="100" placeholder="%"/>
                                </div>
                                <div className="form-group " >
                                <label id="talabel">TA</label>
                                <input onChange={this.handleCompute} type="number" name="ta" className="form-control" id="ta"  />
                                </div>
                                <div className="form-group " >
                                <label id="medicalallowancelabel">MA</label>
                                <input onChange={this.handleCompute} type="number" name="medicalallowance" className="form-control" id="medicalallowance" />
                                </div>

                                <div className="form-group " >
                                <label id="pflabel">PF</label>
                                <input onChange={this.handleCompute} type="number" name="pf" className="form-control" id="pf"  max="100" placeholder="%"/>
                                </div>
                                <div className="form-group " >
                                <label id="itlabel">IT</label>
                                <input onChange={this.handleCompute} type="number" name="it" className="form-control" id="it"  max="100" placeholder="%"/>
                                </div>
                                <div className="form-group " >
                                <label id="loanlabel">Loans</label>
                                <input onChange={this.handleCompute} type="number" name="loans" className="form-control" id="loan"/>
                                <div className="form-group " >
                                <label id="advancelabel">Advance</label>
                                <input onChange={this.handleCompute} type="number" name="salaryadvance" className="form-control" id="advance"  />
                                </div>
                                </div>
                               </div>
                           </div>
                           <button onClick={this.handleComputeSubmit} id="computebtn" className="btn btn-purple">COMPUTE</button>
                    </div>
                    <div className="col-md-12 " style={{minHeight:"200px",border: '1px solid grey',maxWidth:"97%",position:"relative",left:"22px"}}>
                        {this.state.computetableflag && this.state.payhead.length > 0 ?
                        <div className="table-responsive">
                            <table className="table table-bordered mt-3" id="computetable">
                            <thead>
                                <tr>
                                    {this.state.payhead.map((item,index)=>{
                                        return <td key={index}>{Object.keys(item)}</td>
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                            <tr>
                                {this.state.payhead.map((item,index)=>{
                                        return <td key={index}>{Object.values(item)}</td>
                                    })}
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        :null}

                    <button
                    style={{position:"absolute",top:"130px",left:"750px"}}
                    onClick={this.handleSubmit}
                    className="btn btn-primary">SUBMIT</button>
                    </div>
                </div>}

                </div>

        )
    }
}

export default React.memo(CreatePayroll);
