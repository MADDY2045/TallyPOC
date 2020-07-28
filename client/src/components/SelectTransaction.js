import React from 'react';
import '../App.css'

const SelectTransaction = (props) => {



    return (
        <div>
            <span>
            <button  id="reconcile-btn" style={{position:"relative",left:"150px",top:"18px"}} onClick={props.onClick} className="btn btn-outline-secondary">RECONCILE</button>
            <select
                style={{position:"relative",left:"-190px",top:"-30px"}}
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
          </span>
        </div>
    );
}

export default SelectTransaction;
