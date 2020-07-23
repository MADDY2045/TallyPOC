import React,{useState,useEffect,useMemo} from 'react';
import '../App.css';

const Tally = (props) => {
    const [gsalltxnArray,setgsAlltxnArray ] = useState([]);
    const [txnLoader,setTxnLoader] = useState(false);
    const [voucherArray,setVoucherArray]=useState([]);
    const [inditallyArray,setindiTallyArray] = useState([]);
    const [missingVoucherArray,setmissingVoucherArray] = useState([]);

    useEffect(() => {

        if(props.response!==undefined && props.option!=='Choose' && props.option!==''){
            if(props.option==='All'){
                console.log('props.response in tally is',props.response[0]);
                setgsAlltxnArray(props.response[0]);
            }else{
                console.log('props.response in tally individual is',props.response[0]);
                setindiTallyArray(props.response[0]);
                console.log('missing in tally individual is',props.response[3]);
                setmissingVoucherArray(props.response[3]);
                //setgsAlltxnArray(props.response[0]);
            }

           }
           return ()=>{
            console.log("cleaned arrays in tally!!!");
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
},[gsalltxnArray])

useEffect(() => {
    let tempArr = [];
    if(gsalltxnArray!==undefined && gsalltxnArray.length>0){
       gsalltxnArray.map(item=>{
        Object.keys(item).map(element=>{
           if(element!=='amount'){
                tempArr.push(item[element].length)
            }
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
                <h4 style={{position:"absolute",top:"10px",left:"200px"}}>TALLY APP TOTAL VOUCHERS-COUNT-WISE </h4>
        <table className="table table-hover bg-warning table-striped mt-5 table-bordered" style={{borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden'}}>

            <thead>
                <tr>
                <th id="tally-header">Sales Invoice</th>
                <th id="tally-header">Purchase Invoice</th>
                <th id="tally-header">Delivery Note</th>
                <th id="tally-header">Receipt Note</th>
                <th id="tally-header">Journal Voucher</th>
                <th id="tally-header">Receipt Voucher</th>
                <th id="tally-header">Payment Voucher</th>
                <th id="tally-header">Credit Note</th>
                <th id="tally-header">Debit Note</th>
                <th id="tally-header">Stock Journal</th>
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
        <h4 style={{position:"absolute",top:"10px",left:"200px"}}>TALLY APP TOTAL AMOUNT-WISE </h4>
        <table className="table table-hover bg-warning table-striped mt-5 table-bordered" style={{borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden'}}>
            <thead>
                <tr>
                <th id="tally-header">Sales Invoice</th>
                <th id="tally-header">Purchase Invoice</th>
                <th id="tally-header">Delivery Note</th>
                <th id="tally-header">Receipt Note</th>
                <th id="tally-header">Journal Voucher</th>
                <th id="tally-header">Receipt Voucher</th>
                <th id="tally-header">Payment Voucher</th>
                <th id="tally-header">Credit Note</th>
                <th id="tally-header">Debit Note</th>
                <th id="tally-header">Stock Journal</th>
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
                    <h4>TALLY APP</h4>
                        <div className="table-responsive">
                            <table className="table table-hover bg-warning table-striped mt-5 table-bordered" style={{borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden'}}>
                                <thead>
                                    <tr>
                                        <th id="tally-header">{props.option}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                {inditallyArray && inditallyArray[props.option] ? <td className="bg-light">{inditallyArray[props.option].length}</td>:<td>{null}</td>}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-6" style={{minHeight:"300px"}}>
                    <h4 style={{visibility:"hidden"}}>TALLY APP</h4>
                        <div className="table-responsive">
                            <table className="table table-hover bg-warning table-striped mt-5 table-bordered" style={{borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden'}}>
                                <thead>
                                    <tr>
                                        <th id="tally-header">{props.option}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {inditallyArray && inditallyArray[props.option] ? <td className="bg-light">{inditallyArray.amount}</td>:<td>{null}</td>}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-12" style={{minHeight:"398px",maxHeight:"398px",overflowY:"auto"}}>
                        <div className="table-responsive" >
                            <table className="table table-hover bg-light table-striped table-bordered" style={{borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden',position:"absolute",top:"30px",left:"12px",width:"97%"}}>
                                <thead>
                                    <tr className="bg-warning">
                                        <th colspan="6" id="tally-header">Missing Vouchers</th>
                                    </tr>
                                    <tr className="bg-warning">
                                        <th id="tally-header">Tally ID</th>
                                        <th id="tally-header">Voucher Number</th>
                                        <th id="tally-header">Voucher Type</th>
                                        <th id="tally-header">Date</th>
                                        <th id="tally-header">Amount</th>
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

export default Tally;
