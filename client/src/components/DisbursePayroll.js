import React,{ useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dateformat from 'dateformat';
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
const DisbursePayroll = () => {

    const [ cancelData,setCancelData ] = useState([]);
    const [tallyerrormsg,setTallyerrormsg]=useState('');
    const [tallyerrormsgflag,setTallyerrormsgflag]=useState(false);

    const notify = () => toast.success('Approved Successfully!!!!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });

    const notifycancel = () => toast.success('Cancelled Successfully!!!!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });

useEffect(()=>{
    if(tallyerrormsg!==''){
        notifyerror();
    }
},[tallyerrormsgflag])

const notifyerror = () => toast.warning(`${tallyerrormsg}`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });

    const loaddata =()=>{
        axios.get('http://localhost:5050/getallemployeesalarydetails',{cancelToken: source.token}).then(response=>{

            console.log(response.data);
            setCancelData(response.data)
        }).catch(err=>{
            if (axios.isCancel(err)) {
                console.log('Request canceled', err.message);
              } else {
                console.log(err);
              }
        });
    }

    useEffect(() => {
        loaddata()
        return () => {
            setCancelData([])
        };
    }, []);


    const getdate=(date)=>{
        return dateformat(date,"dd/mm/yyyy")
    }

    const handleApprove=(id)=>{
        try{
            axios.get(`http://localhost:5050/approvesalary/${id}`).then(response=>{
                            console.log(response.data);
                            if(response.data==="success"){
                                notify();
                                loaddata();
                            }else{
                                setTallyerrormsg(response.data);
                                setTallyerrormsgflag(!tallyerrormsgflag);
                            }
               }).catch(err=>{console.log('err',err);})

        }catch(error){
            console.log('error in catch',error);
        }
}

const handleCancel=(id,vouchertype,date)=>{
    try{
        axios.get(`http://localhost:5050/cancelpayroll/${id}/${vouchertype}/${date}`).then(response=>{

            console.log('response is',response.data);
            if(response.data!==undefined && response.data!=='error' ){
                let LASTVCHID = Number(response.data[0]['LASTVCHID']);
                let tallyid = Number(id);
               if(tallyid===LASTVCHID){
                    console.log("cancelled and altered");
                    notifycancel();
                    loaddata();
                  }
                }else{
                    alert('Oops!!error in cancelling')
                }
            }).catch(err=>{console.log('err',err);})

    }catch(error){
        console.log('error in catch',error);
    }
}


const getpayhead=(data,item)=>{
    // console.log(cancelData[0].payhead);
    var output = item.payhead.filter(head=>Object.keys(head)[0]===data);
   if(output!==undefined && output[0] !== undefined){
        return Object.values(output[0]);
    }else{
        return null;
    }

}
    return (
        <div>
            <div className="row">
            <ToastContainer />
                <div className="col-md-12">
                <Link className="btn bg-light text text-dark" to={"/"}>GO TO RECONCILE PAGE</Link>
                </div>
                <div className="col-md-12">
                <div className="table-responsive" >
                            <table className="table table-hover bg-light table-striped table-bordered" style={{borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden',position:"absolute",top:"30px",left:"30px",width:"97%"}}>
                                <thead>
                                    <tr className="bg-warning">
                                        <th colSpan="15" id="tally-header">Payroll Details</th>
                                    </tr>
                                    <tr className="bg-warning">
                                        <th id="tally-header">Name</th>
                                        <th id="tally-header">ID</th>
                                        <th id="tally-header">Role</th>
                                        <th id="tally-header">Basic</th>
                                        <th id="tally-header">DA</th>
                                        <th id="tally-header">HRA</th>
                                        <th id="tally-header">TA</th>
                                        <th id="tally-header">Medical Allowance</th>
                                        <th id="tally-header">PF</th>
                                        <th id="tally-header">IT</th>
                                        <th id="tally-header">Loans</th>
                                        <th id="tally-header">Salary Advance</th>
                                        <th id="tally-header">Date</th>
                                        <th id="tally-header">NetPay</th>
                                        <th id="tally-header">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cancelData.map(item=>{
                                        return (<tr key={item._id}>
                                                <td>{item.name}</td>
                                                <td>{item.id}</td>
                                                <td>{item.role}</td>
                                                <td>{getpayhead('Basic Pay',item)}</td>
                                                <td>{getpayhead('DA',item)}</td>
                                                <td>{getpayhead('HRA',item)}</td>
                                                <td>{getpayhead('TA',item)}</td>
                                                <td>{getpayhead('Medical Allowance',item)}</td>
                                                <td>{getpayhead('PF',item)}</td>
                                                <td>{getpayhead('IT',item)}</td>
                                                <td>{getpayhead('Loans',item)}</td>
                                                <td>{getpayhead('Salary Advance',item)}</td>
                                                <td>{getdate(item.date)}</td>
                                                <td>{item.netpay}</td>
                                                <td><button
                                                onClick={()=>handleApprove(item.id)}
                                                className="btn btn-secondary" disabled={item.approved}>Approve</button>
                                                |<button
                                                onClick={()=>handleCancel(item.tallyid,item.vouchertype,item.date)}
                                                className="btn btn-danger" disabled={item.cancelflag}>Cancel</button>
                                                </td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                </div>
    );
}

export default DisbursePayroll;
