import React,{ useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const CancelFlow = () => {

    const [ cancelData,setCancelData ] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:6050/posttransaction').then(response=>{
            console.log("response is",response.data);
            setCancelData(response.data)
        }).catch(err=>console.log(err));
        return () => {
            setCancelData([])
        };
    }, []);

    return (
        <div>
            <div className="row">
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
                                                <td>{item.date}</td>
                                                <td><button className="btn btn-secondary">Cancel</button></td>
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
