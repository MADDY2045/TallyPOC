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
        });;

    useEffect(() => {
        axios.get('http://localhost:5050/posttransaction').then(response=>{
            console.log('cancel flow data',response.data);
            setCancelData(response.data)
        }).catch(err=>console.log(err));
        return () => {
            setCancelData([])
        };
    }, [setCancelData]);


    const getdate=(date)=>{
        return dateformat(date,"dd/mm/yyyy")
    }

    const handleCancel=(id,vouchertype,vouchernumber)=>{
        try{
            axios.get(`http://localhost:5050/canceltally/${id}/${vouchertype}/${vouchernumber}`).then(response=>{

                console.log(response.data);
                if(response.data!==undefined ){
                    let LASTVCHID = Number(response.data[0]['LASTVCHID']);
                    let tallyid = Number(id);
                    console.log('in tally',LASTVCHID,"in gs",tallyid);
                    console.log(response.data[0]["ALTERED"]);
                    if(tallyid===LASTVCHID){
                        console.log("cancelled and altered");
                        window.location.reload(true);
                        }

                }
                }).catch(err=>{
                console.log('err',err);})
            notify();
        }catch(error){
            console.log('error in catch',error);
        }
}

    return (
        <div>
            <div className="row">
            <ToastContainer />
                <div className="col-md-12">
                <Link className="btn btn-primary" to={"/"}>RECONCILE</Link>
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
                                                onClick={()=>handleCancel(item.tallyid,item.vouchertype,item.date)}
                                                className="btn btn-secondary" disabled={item.cancelflag}>Cancel</button></td>
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
