import React,{useState,useEffect} from 'react';


const GsApp = (props) => {

    const [gsalltxnArray,setgsAlltxnArray ] = useState([]);
    const [txnLoader,setTxnLoader] = useState(false);
    const [voucherArray,setVoucherArray]=useState([]);
    const [indigsArray,setindiGsArray] = useState([]);
    const [missingVoucherArray,setmissingVoucherArray] = useState([]);

    useEffect(() => {

        if(props.response!==undefined && props.option!=='Choose' && props.option!==''){
            if(props.option==='All'){
               setgsAlltxnArray(props.response[1]);
            }else{
                setindiGsArray(props.response[1]);
                setmissingVoucherArray(props.response[2]);
                //setgsAlltxnArray(props.response[1]);
            }

           }
           return ()=>{
              setgsAlltxnArray([]);
           }
        }, [props]);



useEffect(()=>{
    if(props.option==='All' && props.option!=='Choose' && props.option!==''){
        if(gsalltxnArray!==undefined && gsalltxnArray.length>0 ){
            setTxnLoader(true);
         }else{
            setTxnLoader(false);
         }
    }else{
        if(props.option!=='All' && props.option!=='Choose' && props.option!==''){
        setTxnLoader(true);
        }else{
            setTxnLoader(false);
        }

    }
},[gsalltxnArray,props.option])

useEffect(() => {
    let tempArr = [];
    if(gsalltxnArray!==undefined && gsalltxnArray.length>0){
       gsalltxnArray.map(item=>{
        return Object.keys(item).map(element=>{
           if(element!=='amount'){
                tempArr.push(item[element].length)
            }
            return tempArr;
        })
    })
    }
    setVoucherArray(tempArr);
   }, [gsalltxnArray]);


    return (

        <div>
            { txnLoader ?
            <div>
                {props.option === 'All' ?
                <div className="row">
                <div className="col-md-12  table-responsive" style={{maxWidth:"830px",overflow:"auto",position:"absolute",top:"100px"}}>
                <h4 style={{position:"absolute",top:"10px",left:"200px"}}>GS APP TOTAL VOUCHERS-COUNT-WISE </h4>
        <table className="table table-hover bg-primary table-striped mt-5 table-bordered" style={{boxShadow:"6px 6px 6px grey",borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden'}}>

            <thead>
                <tr>
                <th id="gs-header">Sales Invoice</th>
                <th id="gs-header">Purchase Invoice</th>
                <th id="gs-header">Delivery Note</th>
                <th id="gs-header">Receipt Note</th>
                <th id="gs-header">Journal Voucher</th>
                <th id="gs-header">Receipt Voucher</th>
                <th id="gs-header">Payment Voucher</th>
                <th id="gs-header">Credit Note</th>
                <th id="gs-header">Debit Note</th>
                <th id="gs-header">Stock Journal</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {voucherArray.map((item,index)=>{
                        return <td className="bg-light" key={index}>{item}</td>
                    })}
                </tr>

            </tbody>
        </table>
        </div>
        <div className="col-md-12  table-responsive" style={{maxWidth:"830px",overflow:"auto",position:"absolute",top:"400px"}}>
        <h4 style={{position:"absolute",top:"10px",left:"200px"}}>GS APP TOTAL AMOUNT-WISE </h4>
        <table className="table table-hover bg-primary table-striped mt-5 table-bordered" style={{boxShadow:"6px 6px 6px grey",borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden'}}>
            <thead>
                <tr>
                <th id="gs-header">Sales Invoice</th>
                <th id="gs-header">Purchase Invoice</th>
                <th id="gs-header">Delivery Note</th>
                <th id="gs-header">Receipt Note</th>
                <th id="gs-header">Journal Voucher</th>
                <th id="gs-header">Receipt Voucher</th>
                <th id="gs-header">Payment Voucher</th>
                <th id="gs-header">Credit Note</th>
                <th id="gs-header">Debit Note</th>
                <th id="gs-header">Stock Journal</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    { gsalltxnArray && gsalltxnArray.length> 0 ? gsalltxnArray.map((item,index)=>{
                        return  <td className="bg-light" key={index}>{item.amount}</td>
                    }):null
                    }
                </tr>
            </tbody>
        </table>
        </div>
    </div>

: <div>
    <div className="row">
        <div className="col-md-6" style={{minHeight:"300px"}}>
            <h4>GS APP</h4>
            <div className="table-responsive">
                <table
                id="table-gs"
                className="table table-hover bg-primary table-striped mt-5 table-bordered" style={{borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden'}}>
                    <thead>
                        <tr>
                            <th id="gs-header">{props.option}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        {indigsArray && indigsArray[props.option] ? <td className="bg-light">{indigsArray[props.option].length}</td>:<td>{null}</td>}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div className="col-md-6" style={{minHeight:"300px"}}>
        <h4 style={{visibility:"hidden"}}>GS APP</h4>
            <div className="table-responsive">
                <table
                id="table-gs"
                className="table table-hover bg-primary table-striped mt-5 table-bordered" style={{borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden'}}>
                    <thead>
                        <tr>
                            <th id="gs-header">{props.option}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                    {indigsArray && indigsArray[props.option] ? <td className="bg-light">{indigsArray.amount}</td>:<td>{null}</td>}
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div className="col-md-12" style={{minHeight:"398px",maxHeight:"398px",overflowY:"auto"}}>
                        <div className="table-responsive" >
                            <table
                            id="table-gs"
                            className="table table-hover bg-light table-striped table-bordered" style={{borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden',position:"absolute",top:"30px",left:"12px",width:"97%"}}>
                                <thead>
                                    <tr className="bg-primary">
                                        <th id="gs-header" colSpan="6">Missing Vouchers</th>
                                    </tr>
                                    <tr className="bg-primary">
                                        <th id="gs-header">Tally ID</th>
                                        <th id="gs-header">Voucher Number</th>
                                        <th id="gs-header">Voucher Type</th>
                                        <th id="gs-header">Date</th>
                                        <th id="gs-header">Amount</th>
                                        <th id="resync-header">{missingVoucherArray && missingVoucherArray.length> 0 ? <button className="btn btn-light">Resync All</button>:<button className="btn btn-light">Nothing to Resync</button>}</th>
                                     </tr>
                                </thead>
                                <tbody>
                                {missingVoucherArray && missingVoucherArray.length>0 ? missingVoucherArray.map(( listValue, index ) => {
                                    return (
                                        <tr key={index}>
                                        <td>{listValue.tallyid}</td>
                                        <td>{listValue.vouchernumber}</td>
                                        <td>{listValue.vouchertype}</td>
                                        <td>{listValue.date}</td>
                                        <td>{listValue.amount}</td>
                                        <td><button className="btn btn-primary">Resync</button>|<button className="btn btn-danger">Delete</button></td>
                                        </tr>
                                    );
                                    }):null}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            }
                            </div>:<div>
                {/* {indi data goes here} */}
                        {null}
                  {/* {indi data ends here} */}
                </div>}
        </div>

    );
}


export default GsApp;
