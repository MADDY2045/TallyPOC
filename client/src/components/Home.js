import React,{useState,useEffect} from 'react';
import GsApp from '../components/GsApp';
import Tally from '../components/Tally';
import { parseString } from 'xml2js';
import axios from 'axios';
import qs from 'qs';
import request from "request";
import utf8 from 'utf8';


var xmlstring = '<ENVELOPE><HEADER><TALLYREQUEST>Export Data</TALLYREQUEST></HEADER><BODY><EXPORTDATA><REQUESTDESC><REPORTNAME>Day Book</REPORTNAME><STATICVARIABLES><SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT><SVCURRENTCOMPANY>Main</SVCURRENTCOMPANY><SVFROMDATE>20190401</SVFROMDATE><SVTODATE>20190401</SVTODATE></STATICVARIABLES></REQUESTDESC></EXPORTDATA></BODY></ENVELOPE>';

const Home = () => {

    const [loader,setLoader] = useState(false);
    const [jsondata,setJsondata] = useState([]);
    const [optionvalue,setOptionvalue] = useState('');

    useEffect(()=>{
        parseString(xmlstring,(err,result)=>{
            setJsondata(result);
        })
    },[])


    const handleSubmit=()=>{
        if(loader){
            axios.get('http://localhost:5050/gettallydetails')
            .then(response=>{
                setJsondata(response.data);
             })
            .catch(err=>console.log(err));
        }
    }

   const handleOption=(e)=>{
        setOptionvalue(e.target.value)
    }
    useEffect(()=>{
        // console.log('jsondata',jsondata);
    },[jsondata]);

    useEffect(()=>{
        if(optionvalue.trim() !='' && optionvalue.trim() !== 'Choose' ){
            setLoader(true);
        }else{
            setLoader(false);
        }
    },[optionvalue]);

return (
        <div>
            <div className="row">
                <div className="col-md-4">
                <div className="input-group">
                <select
                onChange={handleOption}
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
                <button onClick={handleSubmit} className="btn btn-outline-secondary">RECONCILE</button>
            </div>
            </div>
                </div>
            </div>

            <GsApp trandata={jsondata}/>
            <Tally trandata={jsondata}/>
        </div>
    );
}

export default Home;
