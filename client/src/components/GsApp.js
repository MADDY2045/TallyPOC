import React,{useState,useEffect} from 'react';
import { Button,Modal } from 'react-bootstrap';

const GsApp = (props) => {

    const [modalShow, setModalShow] = React.useState(false);
    const [resyncShow, setResyncShow] = React.useState(false);
    const [resyncAllShow, setResyncAllShow] = React.useState(false);
    const [gsalltxnArray,setgsAlltxnArray ] = useState([]);
    const [txnLoader,setTxnLoader] = useState(false);
    const [voucherArray,setVoucherArray]=useState([]);
    const [indigsArray,setindiGsArray] = useState([]);
    const [missingVoucherArray,setmissingVoucherArray] = useState([]);
    const [detailsData,setDetailsData] = useState([]);
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

const handleDetailsdata=(data)=>{
        setModalShow(true);
        setDetailsData(data);
}

const handleResyncdata=(data)=>{
    setResyncShow(true);
    setDetailsData(data);
}

const handleResyncAlldata=(data)=>{
    setResyncAllShow(true);
    setDetailsData(data);
}

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
                                        <th id="resync-header">{missingVoucherArray && missingVoucherArray.length> 0 ? <button
                                        onClick={()=>handleResyncAlldata(missingVoucherArray)}
                                        className="btn btn-light">Resync All</button>:<button className="btn btn-light">Nothing to Resync</button>}</th>
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
                                        <td><button
                                        onClick={()=>handleResyncdata(listValue)}
                                        className="btn btn-primary">Resync</button>|
                                        <button  className="btn btn-danger" variant="danger"  onClick={()=>handleDetailsdata(listValue)}>
                                           Details
                                        </button></td>
                                        </tr>
                                    );
                                    }):null}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <MyVerticallyCenteredModal
                        data={detailsData}
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                    />
                     <ResyncModal
                        data={detailsData}
                        show={resyncShow}
                        onHide={() => setResyncShow(false)}
                    />
                    <ResyncAllModal
                        data={detailsData}
                        show={resyncAllShow}
                        onHide={() => setResyncAllShow(false)}
                    />
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

function MyVerticallyCenteredModal(props) {

    const handleProps=()=>{
        console.log(props)
    }
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
          Detail Page
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Transaction Details</h4>
         <div className="table-responsive">
             <table className="table table-striped table-bordered bg-info">
                <thead>
                    <tr>
                        <td>Voucher</td>
                        <td>Created By</td>
                        <td>Amount</td>
                        <td>Date</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Pinv123</td>
                        <td>Madhavan</td>
                        <td>Rs. 3000</td>
                        <td>2019/05/01</td>
                    </tr>
                </tbody>
             </table>
         </div>
        </Modal.Body>
        <Modal.Footer>
         <button className="btn btn-success" onClick={handleProps}><i className="fa fa-share-alt" aria-hidden="true"></i>  Trace</button>
        <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  function ResyncModal(props) {

    const handleProps=()=>{
        console.log(props)
    }
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
        <h4>Are you sure to Resync ?</h4>
        </Modal.Header>
        <Modal.Body style={{minHeight:'100px'}}>
            <div>
            <button className="btn btn-success"
          style={{position:"absolute",left:'250px'}}
          onClick={handleProps}>Yes</button>
        <Button
        style={{position:"absolute",left:'400px'}}
        onClick={props.onHide}>No</Button>
            </div>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    );
  }

  function ResyncAllModal(props) {

    const handleProps=()=>{
        console.log(props)
    }
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
        <h4>Are you sure to Resync All?</h4>
        </Modal.Header>
        <Modal.Body style={{minHeight:'100px'}}>
            <div>
            <button className="btn btn-success"
          style={{position:"absolute",left:'250px'}}
          onClick={handleProps}>Yes</button>
        <Button
        style={{position:"absolute",left:'400px'}}
        onClick={props.onHide}>No</Button>
            </div>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    );
  }
export default GsApp;
