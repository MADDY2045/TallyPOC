import React,{useState,useEffect} from 'react';

const GsApp = (props) => {
    return (
        <div className="row">
            <div className="col-md-12  table-responsive" style={{maxWidth:"800px",overflow:"auto",boxSizing: 'border-box'}}>
            <table className="table table-striped mt-5 table-bordered" >
                <thead>
                    <tr>
                    <th>Sales Invoice</th>
                    <th>Purchase Invoice</th>
                    <th>Delivery Note</th>
                    <th>Receipt Note</th>
                    <th>Journal Voucher</th>
                    <th>Receipt Voucher</th>
                    <th>Payment Voucher</th>
                    <th>Credit Note</th>
                    <th>Debit Note</th>
                    <th>Stock Journal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>

                </tbody>
            </table>
            </div>
            <div className="col-md-12  table-responsive" >
            <table className="table table-striped mt-5 table-bordered " style={{overflow:"hidden"}}>
                <thead>
                    <tr>
                    <th>Sales Invoice</th>
                    <th>Purchase Invoice</th>
                    <th>Delivery Note</th>
                    <th>Receipt Note</th>
                    <th>Journal Voucher</th>
                    <th>Receipt Voucher</th>
                    <th>Payment Voucher</th>
                    <th>Credit Note</th>
                    <th>Debit Note</th>
                    <th>Stock Journal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>

                </tbody>
            </table>
            </div>
        </div>
    );
}

export default GsApp;
