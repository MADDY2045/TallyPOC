import React,{useState,useEffect} from 'react';
import GsApp from '../components/GsApp';
import Tally from '../components/Tally';
import axios from 'axios';
import {parseString} from 'xml2js';

var xmlstring = '<ENVELOPE><HEADER><TALLYREQUEST>Export Data</TALLYREQUEST></HEADER><BODY><EXPORTDATA><REQUESTDESC><REPORTNAME>Day Book</REPORTNAME><STATICVARIABLES><SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT><SVCURRENTCOMPANY>Main</SVCURRENTCOMPANY><SVFROMDATE>20190401</SVFROMDATE><SVTODATE>20190401</SVTODATE></STATICVARIABLES></REQUESTDESC></EXPORTDATA></BODY></ENVELOPE>';

const Navbar = () => {

    const [optionvalue,setOptionvalue]=useState('');
    const [loader,setLoader]=useState(false);
    const [gsApploader,setGsApploader]=useState(false);
    const [tallyloader,setTallyloader]=useState(false);
    const [gsArray,setGsArray] = useState([]);
    const [gsIndArray,setIndGsArray] = useState([]);
    const [finalgsArray,setfinalGsArray] = useState([]);
    const [tallyArray,setTallyArray] = useState([]);
    const [finalTallyArray,setfinalTallyArray] = useState([]);


    const handleReconcile=()=>{
       setLoader(true);
       setGsApploader(true);
       setTallyloader(true);
    }

    const handleOnchange=(e)=>{
        setOptionvalue(e.target.value);
        setLoader(false);
        setGsApploader(false);
        setTallyloader(false);
        }

        useEffect(() => {

            if(gsApploader){

                if(optionvalue!=='Choose...' && optionvalue!=='' && optionvalue!==null){
                    if(optionvalue==='All'){
                        // console.log('called axios',optionvalue);
                        let GsAppObj=[
                            {'Sales':[],amount:0},
                            {'Purchase':[],amount:0},
                            {'Delivery Note':[],amount:0},
                            {'Receipt Note':[],amount:0},
                            {'Journal':[],amount:0},
                            {'Receipt':[],amount:0},
                            {'Payment':[],amount:0},
                            {'Credit Note':[],amount:0},
                            {'Debit Note':[],amount:0},
                            {'Stock Journal':[],amount:0}
                           ];
                           let tempObj1 = {};
                           let tempArr2 = [];
                        axios.get('http://localhost:6050/posttransaction').then(response=>{
                          tempArr2=response.data;
                          tempArr2.map(item=>{
                            GsAppObj.map(obj=>{
                                let keys=Object.keys(obj);

                                if(item.vouchertype==keys[0]){
                                   obj[keys[1]] += Number(item.amount);
                                   obj[keys[0]].push(item);
                                }
                               })
                           })
                          setGsArray(GsAppObj);
                        }).catch(err=>console.log(err));
                        ////////////////////////////////////
                    }else{
                        // console.log('called axios',optionvalue);
                        let GsAppObj=[
                            {'Sales':[],amount:0},
                            {'Purchase':[],amount:0},
                            {'Delivery Note':[],amount:0},
                            {'Receipt Note':[],amount:0},
                            {'Journal':[],amount:0},
                            {'Receipt':[],amount:0},
                            {'Payment':[],amount:0},
                            {'Credit Note':[],amount:0},
                            {'Debit Note':[],amount:0},
                            {'Stock Journal':[],amount:0}
                           ];
                           let tempObj1 = {};
                           let tempArr2 = [];


                        axios.get('http://localhost:6050/posttransaction').then(response=>{
                          tempArr2=response.data;
                          let GsAppArray = [];
                          response.data.map(item=>{

                            Object.keys(item).map(key=>{

                                if(item[key]==optionvalue){
                                    // console.log('keys are',key);
                                    GsAppArray.push(item)
                                }
                            })
                        })
                        setIndGsArray(GsAppArray);
                        }).catch(err=>console.log(err));

                    }
                }else{
                    setLoader(true);
                    setGsApploader(false);
                    setTallyloader(false);
                }
            }
           }, [gsApploader]);

           useEffect(() => {
               if(tallyloader){
                 console.log('called tally axios',optionvalue);
                 axios.post('http://localhost:9000',{data:xmlstring})
                 .then(response=>{
                     console.log(response);
                                 parseString(response.data, (err, result)=>{

                            })
                             }).catch(err=>console.log(err));
            }
           }, [tallyloader]);

           useEffect(() => {
            //    console.log('gs array changed',gsArray);
            }, [gsArray])

            useEffect(() => {
                // console.log('gs Ind array changed',gsIndArray);
             }, [gsIndArray])

             useEffect(() => {
                console.log('tallyArray changed',tallyArray);
             }, [tallyArray])

    return (
        <div>
            <nav className="navbar navbar-light bg-light">
               <div className="input-group">
                <select
                    onChange={handleOnchange}
                    className="custom-select col-md-3" id="inputGroupSelect04">
                    <option defaultValue>Choose...</option>
                    <option defaultValue="All">All</option>
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
                    <button onClick={handleReconcile} className="btn btn-outline-secondary" type="button">Reconcile</button>
                </div>
                </div>
            </nav>
            <div className="row">
          <div className="col-md-6">
          <GsApp vouchertype={optionvalue} loader={loader} finalgsArray={finalgsArray}/>
          </div>
          <div className="col-md-6">
          <Tally vouchertype={optionvalue} loader={loader}/>
          </div>
        </div>
        </div>
    );
}

export default Navbar;
