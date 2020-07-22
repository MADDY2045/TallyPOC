import React,{useState,useEffect,useMemo} from 'react';

const GsApp = (props) => {

    const [gsalltxnArray,setgsAlltxnArray ] = useState([]);
    const [txnLoader,setTxnLoader] = useState(false);
    const [voucherArray,setVoucherArray]=useState([]);

    useEffect(() => {

        if(props.response!==undefined && props.option!=='Choose' && props.option!==''){
            if(props.option==='All'){
                console.log('props.response in gs App All is',props.response[1]);
                setgsAlltxnArray(props.response[1]);
            }else{
                console.log('props.response in gs App individual is',props.response[0]);
                console.log('props.response in gs App individual is',props.response[3]);
                //setgsAlltxnArray(props.response[1]);
            }

           }
           return ()=>{
               console.log("cleaned arrays in gs!!!");
               setgsAlltxnArray([]);
           }
        }, [props]);


useEffect(()=>{

    if(gsalltxnArray!==undefined && gsalltxnArray.length>0  ){
       setTxnLoader(true);
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
            { txnLoader && props.option === 'All' ?
            <div>
                <div className="row">
                    <div className="col-md-12  table-responsive" style={{maxWidth:"830px",overflow:"auto",position:"absolute",top:"100px"}}>
                    <h4 style={{position:"absolute",top:"10px",left:"200px"}}>GS APP TOTAL VOUCHERS-COUNT-WISE </h4>
            <table className="table table-hover bg-primary table-striped mt-5 table-bordered" style={{borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden'}}>

                <thead>
                    <tr>
                    <th>Sales Invoice</th>
                    <th>Purchase Invoice</th>
                    <th>Delivery Note</th>
                    <th>Receipt Note</th>
                    <th>Journal Voucher</th>
                    <th>Receipt Voucher</th>
                    <th>Payment Voucher</th>
                    <th>Credit Note</th>
                    <th>Debit Note</th>
                    <th>Stock Journal</th>
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
            <table className="table table-hover bg-primary table-striped mt-5 table-bordered" style={{borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden'}}>
                <thead>
                    <tr>
                    <th>Sales Invoice</th>
                    <th>Purchase Invoice</th>
                    <th>Delivery Note</th>
                    <th>Receipt Note</th>
                    <th>Journal Voucher</th>
                    <th>Receipt Voucher</th>
                    <th>Payment Voucher</th>
                    <th>Credit Note</th>
                    <th>Debit Note</th>
                    <th>Stock Journal</th>
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
            </div>:<div>Not True</div>}
        </div>

    );
}

export default GsApp;
