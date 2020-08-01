import React from 'react';
import '../App.css'

const SelectTransaction = (props) => {



    return (
        <div>
            <span>
             <button  id="reconcile-btn" style={{position:"relative",left:"480px",top:"18px"}} onClick={props.onClick} className="btn btn-outline-secondary">RECONCILE</button>
            <select
                style={{position:"relative",left:"140px",top:"-30px",borderRadius:"5px"}}
               onChange={props.onChange}
                className="custom-select" id="inputGroupSelect04">
                    <option  defaultValue>Choose</option>
                    <option id="option" value="All">All</option>
                    <option id="option" value="Sales">Sales Invoice</option>
                    <option id="option" value="Purchase">Purchase Invoice</option>
                    <option id="option" value="Delivery Note">Delivery Note</option>
                    <option id="option" value="Receipt Note">Receipt Note</option>
                    <option id="option" value="Journal">Journal Voucher</option>
                    <option id="option" value="Receipt">Receipt Voucher</option>
                    <option id="option" value="Payment">Payment Voucher</option>
                    <option id="option" value="Credit Note">Credit Note</option>
                    <option id="option" value="Debit Note">Debit Note</option>
                    <option id="option" value="Stock Journal">Stock Journal</option>
                </select>
          </span>
        </div>
    );
}

export default SelectTransaction;
