import React,{ useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dateformat from 'dateformat';
import uuid from 'react-uuid'
import X2JS from 'x2js';
import { payrolltallytemplateall } from '../helpers/PayrollAllTemplate';
import { payrolltallytemplate,ledgerentrieslist,bankallocationslist } from '../helpers/payrolltemplatejson' ;
const CancelToken = axios.CancelToken;
const source = CancelToken.source();



const DisbursePayroll = () => {

    const [ cancelData,setCancelData ] = useState([]);
    const [approveAllflag,setApproveAllflag]=useState(false);
    const [approveAllCancelflag,setApproveAllCancelflag] = useState(true)
    /*start of approval */
    const [cancelAllTallyid,setCancelAllTallyid]=useState('');
    const [cancelAllTallydate,setCancelAllTallydate]=useState('');
    const [cancelAllTallyvchtype,setCancelAllTallyvchtype]=useState('');
    /*end of approval*/



    const notify = () => toast.success('Approved Successfully!!!!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });

    const notifycancel = () => toast.success('Cancelled Successfully!!!!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });

    const loaddata =()=>{
        axios.get('http://localhost:5050/getallemployeesalarydetails',{cancelToken: source.token}).then(response=>{
            let count =0;
            response.data.map(item=>{
                if(item.approved===true){
                    count += 1;
                }
            })

            if (count===response.data.length){
                setApproveAllflag(true);
            }
            setCancelData(response.data);

        }).catch(err=>{
            if (axios.isCancel(err)) {
                console.log('Request canceled', err.message);
              } else {
                console.log(err);
              }
        });
    }

    useEffect(() => {
        loaddata();
        //console.log(payrolltallytemplate);
        return () => {
            setCancelData([])
        };
    }, []);


    const getdate=(date)=>{
        return dateformat(date,"dd/mm/yyyy")
    }

    const handleApprove = (id)=>{
        try{
            let employeesortorder = 0 ;
            let payheadsortorder = 0;
            ledgerentrieslist["BANKALLOCATIONS.LIST"]=[];
            let temppayheadobj={}
            payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"]=[];
            payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"][0]["PAYHEADALLOCATIONS.LIST"]=[];
            // console.log(ledgerentrieslist);
            // console.log(bankallocationslist);

            axios.get(`http://localhost:5050/approvesalary/${id}`).then(response=>{
                           if(response.data.length>0){
                                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDESC"]["STATICVARIABLES"]["SVCURRENTCOMPANY"] = "Main";
                                const formatteddate = dateformat(response.data[0].date,"yyyymmdd");
                                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["DATE"]=formatteddate;
                                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["EFFECTIVEDATE"]=formatteddate;
                                console.log(payrolltallytemplate);
                                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["PARTYLEDGERNAME"]=response.data[0].transactiontype;
                                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["_REMOTEID"]=uuid();
                                if(response.data[0].transactiontype==='Cash'){
                                    ledgerentrieslist["LEDGERNAME"]=response.data[0].transactiontype;
                                    ledgerentrieslist["AMOUNT"]=response.data[0].netpay;
                                    payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"].push(ledgerentrieslist);
                                }else{
                                    /*bank allocation */
                                    ledgerentrieslist["LEDGERNAME"]=response.data[0].transactiontype;
                                    ledgerentrieslist["AMOUNT"]=response.data[0].netpay;
                                    payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"].push(ledgerentrieslist);
                                    bankallocationslist["DATE"]=formatteddate;
                                    bankallocationslist["INSTRUMENTDATE"]=response.data[0].instrumentdate;
                                    bankallocationslist["IFSCODE"]=response.data[0].ifsc;
                                    bankallocationslist["ACCOUNTNUMBER"]=response.data[0].account;
                                    bankallocationslist["PAYMENTFAVOURING"]=response.data[0].name;
                                    bankallocationslist["AMOUNT"]=response.data[0].netpay;
                                    payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"][0]["BANKALLOCATIONS.LIST"].push(bankallocationslist);
                                    //console.log(tempobj)
                                }
                                employeesortorder += 1;
                                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["CATEGORY"] = "Others";
                                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"][0]["AMOUNT"]=-response.data[0].netpay
                                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"][0]["EMPLOYEENAME"]=response.data[0].name
                                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"][0]["EMPLOYEESORTORDER"]=employeesortorder;
                                }

                                response.data[0].payhead.map(eachpayhead=>{
                                    temppayheadobj={}
                                    if(Object.keys(eachpayhead)[0]==='Basic Pay' || Object.keys(eachpayhead)[0]==='DA' || Object.keys(eachpayhead)[0]==='TA' || Object.keys(eachpayhead)[0]==='HRA' || Object.keys(eachpayhead)[0]==='Medical Allowance'){
                                        payheadsortorder += 1
                                        // console.log('earnings',Object.keys(eachpayhead)[0],Object.values(eachpayhead)[0]);
                                        temppayheadobj["PAYHEADNAME"]=Object.keys(eachpayhead)[0];
                                        temppayheadobj["ISDEEMEDPOSITIVE"]="Yes";
                                        temppayheadobj["PAYHEADSORTORDER"]=payheadsortorder;
                                        temppayheadobj["AMOUNT"]=-Object.values(eachpayhead)[0];
                                        payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"][0]["PAYHEADALLOCATIONS.LIST"].push(temppayheadobj);
                                    }else{
                                        payheadsortorder += 1
                                        // console.log('deductions',Object.keys(eachpayhead)[0],Object.values(eachpayhead)[0]);
                                        temppayheadobj["PAYHEADNAME"]=Object.keys(eachpayhead)[0];
                                        temppayheadobj["ISDEEMEDPOSITIVE"]="No";
                                        temppayheadobj["PAYHEADSORTORDER"]=payheadsortorder;
                                        temppayheadobj["AMOUNT"]=Object.values(eachpayhead)[0];
                                        payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"][0]["PAYHEADALLOCATIONS.LIST"].push(temppayheadobj);
                                    }
                                })
                                let x2js = new X2JS();
                                const xmlstring = x2js.js2xml(payrolltallytemplate);
                                //console.log(xmlstring);
                               axios.post(`http://localhost:5050/getapprovalresponse/${id}`,{data:xmlstring}).then(response=>{
                                    console.log(response.data);
                                    if(response.data==='success'){
                                        notify();
                                        loaddata();
                                    }
                                }).catch(err=>console.log(err));
                            }).catch(err=>{console.log('err',err);});


        }catch(error){
            console.log('error in catch',error);
        }
}


/* start of function */


/* end of approval function */






const handleCancel=(id,vouchertype,date)=>{
    try{
        axios.get(`http://localhost:5050/cancelpayroll/${id}/${vouchertype}/${date}`).then(response=>{

            console.log('response is',response.data);
            if(response.data!==undefined && response.data!=='error' ){
                let LASTVCHID = Number(response.data[0]['LASTVCHID']);
                let tallyid = Number(id);
               if(tallyid===LASTVCHID){
                    console.log("cancelled and altered");
                    setApproveAllCancelflag(true);
                    notifycancel();
                    loaddata();
                  }
                }else{
                    alert('Oops!!error in cancelling')
                }
            }).catch(err=>{console.log('err',err);})

    }catch(error){
        console.log('error in catch',error);
    }
}


const getpayhead=(data,item)=>{
    // console.log(cancelData[0].payhead);
    var output = item.payhead.filter(head=>Object.keys(head)[0]===data);
   if(output!==undefined && output[0] !== undefined){
        return Object.values(output[0]);
    }else{
        return null;
    }

}

const handleApproveAll=()=>{
    let payheadsortorder=0;
    let netbatchamount = 0;
    let batchdate ='';
    let temppayheadobj={};
    let empsortorder = 0;
    let employeecategorylist = {}
    employeecategorylist["PAYHEADALLOCATIONS.LIST"]=[]
    ledgerentrieslist["BANKALLOCATIONS.LIST"]=[];
    payrolltallytemplateall["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"]=[];payrolltallytemplateall["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"]=[];


    axios.get("http://localhost:5050/approvepayrollbatch").then(response=>{
        response.data.map(item=>{
            netbatchamount += item.netpay;
            batchdate = item.date;
        })
        console.log(payrolltallytemplateall);

        payrolltallytemplateall["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDESC"]["STATICVARIABLES"]["SVCURRENTCOMPANY"] = "Main";
        const formatteddate = dateformat(batchdate,"yyyymmdd");
        payrolltallytemplateall["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["DATE"]=formatteddate;
        payrolltallytemplateall["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["EFFECTIVEDATE"]=formatteddate;
        payrolltallytemplateall["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["_REMOTEID"]=uuid();

        let filteredarray = response.data.filter(element=> element.transactiontype!=='Cash');
        console.log('filtered array',filteredarray);
        if(filteredarray && filteredarray!==undefined && filteredarray.length>0){

            payrolltallytemplateall["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["PARTYLEDGERNAME"]=filteredarray[0].transactiontype;
            ledgerentrieslist["LEDGERNAME"]=filteredarray[0].transactiontype;
                ledgerentrieslist["AMOUNT"]=netbatchamount;
                const formatteddate = dateformat(filteredarray[0].date,"yyyymmdd");
                bankallocationslist["DATE"]=formatteddate;
                bankallocationslist["INSTRUMENTDATE"]=filteredarray[0].instrumentdate;
                bankallocationslist["IFSCODE"]=filteredarray[0].ifsc;
                bankallocationslist["ACCOUNTNUMBER"]=filteredarray[0].account;
                bankallocationslist["PAYMENTFAVOURING"]=filteredarray[0].name;
                bankallocationslist["AMOUNT"]=netbatchamount;
                payrolltallytemplateall["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"].push(ledgerentrieslist);
                payrolltallytemplateall["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"][0]["BANKALLOCATIONS.LIST"].push(bankallocationslist);
        }else{

            payrolltallytemplateall["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["PARTYLEDGERNAME"]=response.data[0].transactiontype;
            ledgerentrieslist["LEDGERNAME"]=response.data[0].transactiontype;
            payrolltallytemplateall["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["PARTYLEDGERNAME"]=response.data[0].transactiontype;
            ledgerentrieslist["AMOUNT"]=netbatchamount;
            payrolltallytemplateall["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"].push(ledgerentrieslist);
        }
        payrolltallytemplateall["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["CATEGORY"] = "Others";

        response.data.map(element=>{
            employeecategorylist={};
            empsortorder += 1;
            employeecategorylist["EMPLOYEENAME"] = element.name;
            employeecategorylist["EMPLOYEESORTORDER"] = empsortorder;
            employeecategorylist["AMOUNT"] = -element.netpay;
            payrolltallytemplateall["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"].push(employeecategorylist);

            employeecategorylist["PAYHEADALLOCATIONS.LIST"]=[]

           element.payhead.map(eachpayhead=>{
            temppayheadobj={};
               if(Object.keys(eachpayhead)[0] === 'Basic Pay' || Object.keys(eachpayhead)[0] === 'DA' || Object.keys(eachpayhead)[0] === 'HRA' || Object.keys(eachpayhead)[0] === 'TA' || Object.keys(eachpayhead)[0] === 'Medical Allowance'){
                   payheadsortorder += 1;

                temppayheadobj["PAYHEADNAME"]=Object.keys(eachpayhead)[0];
                temppayheadobj["ISDEEMEDPOSITIVE"]="Yes";
                temppayheadobj["PAYHEADSORTORDER"]=payheadsortorder;
                temppayheadobj["AMOUNT"]=-Object.values(eachpayhead)[0];
                employeecategorylist["PAYHEADALLOCATIONS.LIST"].push(temppayheadobj)

               }else{
                payheadsortorder += 1;

                temppayheadobj["PAYHEADNAME"]=Object.keys(eachpayhead)[0];
                temppayheadobj["ISDEEMEDPOSITIVE"]="No";
                temppayheadobj["PAYHEADSORTORDER"]=payheadsortorder;
                temppayheadobj["AMOUNT"]=Object.values(eachpayhead)[0];
                employeecategorylist["PAYHEADALLOCATIONS.LIST"].push(temppayheadobj)
               }

           })

        })
        let x2js = new X2JS();
        const xmlstringall = x2js.js2xml(payrolltallytemplateall);
        console.log(xmlstringall);
       axios.post(`http://localhost:5050/approveallpayroll`,{data:xmlstringall}).then(response=>{
            console.log(response.data);
            if(response.data.message==='success'){
                notify();
                setApproveAllCancelflag(false);
                setCancelAllTallyid(response.data.tallyid);
                setCancelAllTallydate(response.data.date);
                setCancelAllTallyvchtype(response.data.vouchertype);
                loaddata();
            }
           }).catch(err=>console.log(err));

    }).catch(err=>console.log(err))
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
                            <table className="table table-hover bg-light table-striped table-bordered"
                            style={{ boxShadow: '1px 6px 6px black',borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden',position:"absolute",top:"30px",left:"30px",width:"97%"}}>
                                <thead>
                                    <tr className="bg-warning">
                                        <th colSpan="15" id="tally-header">Payroll Details</th>
                                    </tr>
                                    <tr className="bg-warning">
                                        <th id="tally-header">Name</th>
                                        <th id="tally-header">ID</th>
                                        <th id="tally-header">Role</th>
                                        <th id="tally-header">Basic</th>
                                        <th id="tally-header">DA</th>
                                        <th id="tally-header">HRA</th>
                                        <th id="tally-header">TA</th>
                                        <th id="tally-header">Medical Allowance</th>
                                        <th id="tally-header">PF</th>
                                        <th id="tally-header">IT</th>
                                        <th id="tally-header">Loans</th>
                                        <th id="tally-header">Salary Advance</th>
                                        <th id="tally-header">Date</th>
                                        <th id="tally-header">NetPay</th>
                                        <th id="tally-header"><button onClick={handleApproveAll}
                                        disabled={approveAllflag}
                                        className="btn btn-primary">APPROVE ALL</button>|
                                    <button  onClick={()=>handleCancel(cancelAllTallyid,cancelAllTallyvchtype,cancelAllTallydate)}
                                        disabled={approveAllCancelflag}
                                        className="btn btn-danger">CANCEL</button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cancelData.map(item=>{
                                        return (<tr key={item._id}>
                                                <td>{item.name}</td>
                                                <td>{item.id}</td>
                                                <td>{item.role}</td>
                                                <td>{getpayhead('Basic Pay',item)}</td>
                                                <td>{getpayhead('DA',item)}</td>
                                                <td>{getpayhead('HRA',item)}</td>
                                                <td>{getpayhead('TA',item)}</td>
                                                <td>{getpayhead('Medical Allowance',item)}</td>
                                                <td>{getpayhead('PF',item)}</td>
                                                <td>{getpayhead('IT',item)}</td>
                                                <td>{getpayhead('Loans',item)}</td>
                                                <td>{getpayhead('Salary Advance',item)}</td>
                                                <td>{getdate(item.date)}</td>
                                                <td>{item.netpay}</td>
                                                <td><button
                                                onClick={()=>handleApprove(item.id)}
                                                className="btn btn-primary" disabled={item.approved}>Approve</button>
                                                |<button
                                                onClick={()=>handleCancel(item.tallyid,item.vouchertype,item.date)}
                                                className="btn btn-danger" disabled={item.cancelflag}>Cancel</button>
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

export default DisbursePayroll;
