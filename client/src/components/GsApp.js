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
            { props.optionvalue === 'All' ?
            iteratingArray.length > 0 ?
                <div style={{position:"relative",top:"30px"}}>
                    <h2>GS App</h2>
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
            gsindividualdata.length>0 ?<div className="row">
                <h2 style={{position:"relative",left:"100px",top:"20px"}}>GS App</h2>
                <div className="col-md-6 card" style={{position:"relative",left:'-80px',top:"90px",borderRadius:"50px",minHeight:'350px',maxWidth:'300px'}}>
                <h5 style={{position:"relative",left:'70px',top:"20px"}}>Total Vouchers</h5>
          <table className="table table-bordered table-hover table-info" style={{width:"70%",position:"relative",left:'30px',top:"20px",borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden'}}>
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
              <h5 style={{position:"relative",left:'70px',top:"20px",marginTop:"10px"}}>Total Amount</h5>
              <table className="table table-bordered table-hover table-warning" style={{width:"70%",position:"relative",left:'30px',top:"20px",borderCollapse: 'collapse',borderRadius:'1em',overflow:'hidden'}}>

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

        </div>
    );
}

export default GsApp;
