import React from 'react';

const SelectTransaction = (props) => {
    return (
        <div>
             <div className="row"  style={{position:"relative",left:'65px',top:'20px'}}>
                <div className="col-md-4">
                <div className="input-group">
                <select
                onChange={props.onChange}
                className="custom-select" id="inputGroupSelect04">
                <option defaultValue>Choose</option>
                    <option value="All">All</option>
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
            <div className="input-group-append">
                <button onClick={props.onClick} className="btn btn-outline-secondary">RECONCILE</button>
            </div>
            </div>
</div>
</div>
        </div>
    );
}

export default SelectTransaction;
