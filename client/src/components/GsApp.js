import React,{useEffect,useState } from 'react';

const GsApp = (props) => {

    const [gsindividualdata,setIndividualdata]=useState([]);
    const [iteratingArray,setIteratingArray] = useState([]);
    const [iteratingAmountArray,setIteratingAmountArray] = useState([]);
    const [iteratingindividualArray,setIteratingindividualArray] = useState([]);
    const [matchingGsArray,setMatchingGsArray]=useState([]);
    const [matchingTallyArray,setMatchingTallyArray]=useState([]);
    useEffect(() => {

        if(props.trandata[1]!==undefined){
            if(props.optionvalue==='All'){
                setIndividualdata(props.trandata[1]);
            }else{
               let GsAppArray = [];
                props.trandata[1].map(item=>{
                    Object.keys(item).map(key=>{
                        if(key==props.optionvalue){
                           GsAppArray.push(item)
                        }
                    })
                    setIndividualdata(GsAppArray);

                })
            }

        }
       }, [props.trandata[1]]);

    //    useEffect(()=>{
    //         console.log('gsmissingvouchers',props.gsMissingVouchers);
    //    },[props.gsMissingVouchers])

      useEffect(() => {

            let tempArr=[];
            let tempArr2=[];
            if(gsindividualdata.length>1){
                gsindividualdata.map(item=>{
                    Object.keys(item).map(element=>{
                       if(element!=='amount'){
                           tempArr.push(item[element].length);
                        }else{
                           tempArr2.push(item.amount);
                        }
                    })
                   })
            }
            else{
                let indiArray=[]

                gsindividualdata.map(item=>{
                    Object.keys(item).map(element=>{
                        if(element===props.optionvalue){
                            indiArray.push(element);
                            indiArray.push(item[element].length);
                        }else{
                            indiArray.push(item[element]);
                        }
                    })
                })
                setIteratingindividualArray(indiArray)
            }
            setIteratingArray(tempArr);
            setIteratingAmountArray(tempArr2);
        }, [gsindividualdata]);


           useEffect(() => {
                    setIndividualdata([]);
              }, [props.optionvalue]);




    return (
        <div >
             <h2>GS App</h2>
            { props.optionvalue === 'All' ?
            iteratingArray.length > 0 ?
                <div style={{position:"relative",top:"30px"}}>

               <h4 style={{position:'relative',left:'50px'}}>Total Vouchers</h4>
               <table className="table table-bordered table-responsive table-hover table-info" style={{width:"90%",position:"relative",left:'30px',top:"20px",borderCollapse: 'collapse',borderRadius:'0.5em',overflow:'auto'}}>
                 <thead className="thead-light">
                     <tr>
                     <th scope="col">Sales Invoice</th>
                     <th scope="col">Purchase Invoice</th>
                     <th scope="col">Delivery Note</th>
                     <th scope="col">Receipt Note</th>
                     <th scope="col">Journal Voucher</th>
                     <th scope="col">Receipt Voucher</th>
                     <th scope="col">Payment Voucher</th>
                     <th scope="col">Credit Note</th>
                     <th scope="col">Debit Note</th>
                     <th scope="col">Stock Journal</th>
                     </tr>
                 </thead>
                 <tbody>
                     <tr>
                         {iteratingArray.map((item,index)=>{
                             return <td className="text-center" key={index}>{item}</td>
                         })}
                     </tr>
                     </tbody>
                 </table>
                          <h4 style={{position:'relative',left:'50px',marginTop:'100px'}}>Total Amount</h4>
                          <table className="table table-bordered table-responsive table-hover table-warning" style={{width:"90%",position:"relative",left:'30px',top:"20px",borderCollapse: 'collapse',borderRadius:'0.5em',overflow:'auto'}}>
                 <thead className="thead-light">
                     <tr>
                     <th scope="col">Sales Invoice</th>
                     <th scope="col">Purchase Invoice</th>
                     <th scope="col">Delivery Note</th>
                     <th scope="col">Receipt Note</th>
                     <th scope="col">Journal Voucher</th>
                     <th scope="col">Receipt Voucher</th>
                     <th scope="col">Payment Voucher</th>
                     <th scope="col">Credit Note</th>
                     <th scope="col">Debit Note</th>
                     <th scope="col">Stock Journal</th>
                     </tr>
                 </thead>
                 <tbody>
                     <tr>
                         {iteratingAmountArray.map((item,index)=>{
                             return <td className="text-center" key={index}>{item}</td>
                         })}
                     </tr>
                     </tbody>
                 </table>
          </div>
                : null
            :
            gsindividualdata.length>0 ?
            <div className="row">



            <div className="col-md-6 " style={{position:"absolute",left:"110px",top:'80px'}}>
                <h5 style={{position:"relative",left: '72px',top:"0px"}}>Total Vouchers</h5>
                <table className="table table-bordered table-hover table-info" style={{width:"70%",borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden'}}>
                    <thead className="thead-light">
                        <tr>
                            <th className="text-center">{iteratingindividualArray[0]}</th>
                        </tr>
                </thead>
              <tbody>
                  <tr>
                  <td className="text-center" >{iteratingindividualArray[1]}</td>
                    </tr>
                  </tbody>
              </table>
             </div>
            <div className="col-md-6" style={{position:"absolute",left:"380px",top:'80px'}}>
            <h5 style={{position:"relative",left: '72px',top:"0px"}}>Total Amount</h5>
              <table className="table table-bordered table-hover table-warning" style={{width:"70%",borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden'}}>

              <thead className="thead-light">
                  <tr>
                        <th className="text-center">{iteratingindividualArray[0]}</th>
                    </tr>
              </thead>
              <tbody>
                  <tr>
                  <td className="text-center">{iteratingindividualArray[2]}</td>
                    </tr>
                  </tbody>
              </table>
            </div>

           </div> : null
          }
<div className="col-md-12" style={{position:"absolute",top:'300px'}}>


                        { props.gsMissingVouchers.length >0  && props.optionvalue !=="All" ?
                    <div className="table-responsive table-bordered table-primary" style={{maxWidth:'100%',borderRadius:'10px'}}>
                        <h4>Missing Vouchers</h4>
                    <table class="table">
                    <thead class="thead-light">
                        <tr>
                        <th >Voucher Number</th>
                        <th >Tally Id</th>
                        <th >Voucher type</th>
                        <th >Amount</th>
                        <th >Created On</th>
                        </tr>
                    </thead>
                    <tbody>
                    {props.gsMissingVouchers.map( item => {
                        return (
                            <tr key={item._id}>
                            <td>{item.vouchernumber}</td>
                            <td>{item.tallyid}</td>
                            <td>{item.vouchertype}</td>
                            <td>{item.amount}</td>
                            <td>{item.date}</td>
                            <td><button className="btn btn-primary">Details</button>|<button className="btn btn-primary">Create</button></td>
                            </tr>
                        );
                        })}

                    </tbody>
                    </table>
                    </div>
                        :
                        null
                    }


                </div>
        </div>
    );
}

export default GsApp;
