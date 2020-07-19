import React,{useState,useEffect} from 'react';
import GsApp from '../components/GsApp';
import Tally from '../components/Tally';
import { parseString } from 'xml2js';
import axios from 'axios';

const compareName = (obj1, obj2)=>{
    return (obj1.tallyid === obj2.tallyid);
  }


var xmlstring = '<ENVELOPE><HEADER><TALLYREQUEST>Export Data</TALLYREQUEST></HEADER><BODY><EXPORTDATA><REQUESTDESC><REPORTNAME>Day Book</REPORTNAME><STATICVARIABLES><SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT><SVCURRENTCOMPANY>Main</SVCURRENTCOMPANY><SVFROMDATE>20190401</SVFROMDATE><SVTODATE>20190401</SVTODATE></STATICVARIABLES></REQUESTDESC></EXPORTDATA></BODY></ENVELOPE>';

const Home = () => {

    const [loader,setLoader] = useState(false);
    const [jsondata,setJsondata] = useState([]);
    const [optionvalue,setOptionvalue] = useState('');
    const [tallyMatchingArray,setTallyMatchingArray] = useState([]);
    const [gsMatchingArray,setGsMatchingArray] = useState([]);
    const [gsMissingVouchers,setGsMissingVouchers] = useState([]);
    const [tallyMissingVouchers,setTallyMissingVouchers] = useState([]);


    useEffect(()=>{
        parseString(xmlstring,(err,result)=>{
            setJsondata(result);
        })
       },[])


    const handleSubmit= async ()=>{
        setLoader(true);
       await axios.get('http://localhost:5050/gettallydetails')
                .then(response=>{
                    setJsondata(response.data);
                    setLoader(true);
                    })
                .catch(err=>console.log(err));

        }

   const handleOption=(e)=>{
       e.preventDefault();
       setLoader(false)
        setOptionvalue(e.target.value);
       }

useEffect(()=>{
    setTimeout(()=>{
        if(jsondata[0]!==undefined){
            let tempArr=[];
            let result = jsondata[0].ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE;
            if (optionvalue!=='All' && optionvalue!=='Choose' && optionvalue!==''){
                result.map(item=>{

                    if(item.VOUCHER[0].ISCANCELLED !='Yes' && item.VOUCHER[0].$.VCHTYPE==optionvalue){
                        let tempObj ={};
                        tempObj['tallyid']=item.VOUCHER[0].MASTERID[0].trim();
                        tempObj['vouchernumber']=item.VOUCHER[0].VOUCHERNUMBER[0];
                        tempObj['vouchertype']=item.VOUCHER[0].$.VCHTYPE;
                        tempObj['date']=item.VOUCHER[0].DATE[0];
                       //   tempObj['items']=[];
                       //   tempObj['items'].push(item.VOUCHER[0]);
                       if(item.VOUCHER[0]['ALLINVENTORYENTRIES.LIST']){
                           tempObj['amount']=item.VOUCHER[0]['ALLINVENTORYENTRIES.LIST'][0].AMOUNT[0];
                       }else if(item.VOUCHER[0]['ALLLEDGERENTRIES.LIST']){
                           tempObj['amount']=item.VOUCHER[0]['ALLLEDGERENTRIES.LIST'][0].AMOUNT[0];
                       }else{
                           tempObj['amount']=item.VOUCHER[0]['INVENTORYENTRIESIN.LIST'][0].AMOUNT[0];
                       }

                        tempArr.push(tempObj);
                    }
                    let tallyArrayObj=[
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
                       let tallyAppArr=[];
                    tempArr.map(item=>{
                        tallyArrayObj.map(obj=>{
                            let keys=Object.keys(obj);

                            if(item.vouchertype==keys[0]&&keys[0]==optionvalue){
                               obj[keys[1]] += Number(item.amount);
                               obj[keys[0]].push(item);
                            }
                           })
                       })
                       tallyArrayObj.map(item=>{
                           Object.keys(item).map(key=>{
                               if(key==optionvalue){
                                   tallyAppArr.push(item)
                               }
                           })


                       })
            setTimeout(()=>{
                setTallyMatchingArray(tallyAppArr);
            },0)

                    let GsAppArray = [];
                    jsondata[1].map(item=>{
                        Object.keys(item).map(key=>{
                            if(key==optionvalue){
                                GsAppArray.push(item)
                            }
                        })
                    })
                    setGsMatchingArray(GsAppArray);
                })
            }
        }
    },0)

},[jsondata])

useEffect(()=>{
    let output1=[];
    let output2=[];

    if(tallyMatchingArray[0]!==undefined && gsMatchingArray[0]!==undefined){
        output1 = tallyMatchingArray[0][optionvalue].filter(b=>{
            let indexFound = gsMatchingArray[0][optionvalue].findIndex(a => compareName(a, b));
            return indexFound == -1;
            })
            // console.log('output1',output1);
            setGsMissingVouchers(output1);
            output2 = gsMatchingArray[0][optionvalue].filter(b=>{
            let indexFound = tallyMatchingArray[0][optionvalue].findIndex(a => compareName(a, b));
            return indexFound == -1;
            })
            //console.log('output2',output2);
            setTallyMissingVouchers(output2)
    }

},[tallyMatchingArray])

useEffect(()=>{
    // console.log('gsmatchingarray',gsMatchingArray);
},[gsMatchingArray])

return (
        <div>
            <div className="row"  style={{position:"relative",left:'65px',top:'20px'}}>
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
            { loader && optionvalue!=='' && optionvalue !=='Choose' ? <div className="row" >
                <div className="col=md-6 card mt-auto ml-5" style={{minHeight:'700px',minWidth:'800px',maxWidth:'800px',position:"relative",top:'50px',left:'30px'}}>
                <GsApp trandata={jsondata} optionvalue={optionvalue} loader={loader} gsMissingVouchers={gsMissingVouchers}
                tallyMissingVouchers={tallyMissingVouchers}/>
                </div>
                <div className="col=md-6 card" style={{minHeight:'700px',minWidth:'800px',maxWidth:'800px',position:"relative",left:'80px',top:'50px'}}>
                <Tally trandata={jsondata} optionvalue={optionvalue} loader={loader} tallyMissingVouchers={tallyMissingVouchers}gsMissingVouchers={gsMissingVouchers}/>
                </div>
            </div> :null }

        </div>
    );
}

export default Home;
