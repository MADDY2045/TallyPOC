import React,{ useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dateformat from 'dateformat';

const CancelFlow = () => {

    const [ cancelData,setCancelData ] = useState([]);
    const notify = () => toast.success('Cancelled Successfully!!!!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });

    const notifydeletion = () => toast.warning('Deleted Successfully!!!!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });;

    const loaddata=()=>{
        axios.get('http://localhost:5050/posttransaction').then(response=>{
            setCancelData(response.data)
         }).catch(err=>console.log(err));
    }
    useEffect(() => {
        loaddata();
        return () => {
            setCancelData([])
        };
    }, []);


    const getdate=(date)=>{
        return dateformat(date,"dd/mm/yyyy")
    }

    const handleCancel=(id,vouchertype,date,vouchernumber)=>{
        try{
            axios.get(`http://localhost:5050/canceltally/${id}/${vouchertype}/${date}/${vouchernumber}`).then(response=>{

                console.log('response is',response.data);
                if(response.data!==undefined && response.data!=='error' ){
                    let LASTVCHID = Number(response.data[0]['LASTVCHID']);
                    let tallyid = Number(id);
                   if(tallyid===LASTVCHID){
                        console.log("cancelled and altered");
                        notify();
                        setTimeout(()=>{
                            loaddata();
                        },100)
                      }
                    }else{
                        alert('Oops!!error in cancelling')
                    }
                }).catch(err=>{console.log('err',err);})

        }catch(error){
            console.log('error in catch',error);
        }
}

const handleDelete =(id,vouchertype,date,vouchernumber)=>{
    axios.delete(`http://localhost:5050/deletegsdata/${id}/${vouchertype}/${date}/${vouchernumber}`).then(response=>{
        console.log('is deleted?',response.data)
        if(response.data==="successful"){
            notifydeletion();
            setTimeout(()=>{
                loaddata();
            },100);
        }
    }).catch(err=>console.log(err));
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
                                        <th colSpan="6" id="tally-header">Missing Vouchers</th>
                                    </tr>
                                    <tr className="bg-warning">
                                        <th id="tally-header">Voucher Type</th>
                                        <th id="tally-header">Tally ID</th>
                                        <th id="tally-header">Amount</th>
                                      <th id="tally-header">Voucher Number</th>
                                        <th id="tally-header">Date</th>
                                        <th id="tally-header">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cancelData.map(item=>{
                                        return (<tr key={item._id}>
                                                <td>{item.vouchertype}</td>
                                                <td>{item.tallyid}</td>
                                                <td>{item.amount}</td>
                                                <td>{item.vouchernumber}</td>
                                                <td>{getdate(item.date)}</td>
                                                <td><button
                                                onClick={()=>handleCancel(item.tallyid,item.vouchertype,item.date,item.vouchernumber)}
                                                className="btn btn-secondary" disabled={item.cancelflag}>Cancel</button>
                                                |<button
                                                onClick={()=>handleDelete(item.tallyid,item.vouchertype,item.date,item.vouchernumber)}
                                                className="btn btn-danger">Delete</button>
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

export default CancelFlow;
