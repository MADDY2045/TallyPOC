import React,{useEffect,useState} from 'react';

const Tally = (props) => {

    const [gsAlltallydata,setAlltallydata]=useState([]);
    const [indiTallydata,setInditallydata] = useState([]);
    const [iteratingArray,setIteratingArray] = useState([]);
    const [iteratingAmountArray,setIteratingAmountArray] = useState([]);
    const [iteratingindividualArray,setIteratingindividualArray] = useState([]);

    useEffect(()=>{
        console.log('tallymissingvouchers',props.tallyMissingVouchers);
   },[props.tallyMissingVouchers])


    useEffect(() => {
        if(props.trandata[0]!==undefined){
            if(props.optionvalue==='All'){
               let tempArr=[];
                 props.trandata[0].ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE.pop();
                                 let exportData = props.trandata[0].ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE;
                                                 exportData.map(item=>{
                                                     if(item.VOUCHER[0].ISCANCELLED !='Yes'){
                                                         let tempObj={};
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

                                                 })
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
                                                 tempArr.map(item=>{
                                                     tallyArrayObj.map(obj=>{
                                                         let keys=Object.keys(obj);

                                                         if(item.vouchertype==keys[0]){
                                                            obj[keys[1]] += Number(item.amount);
                                                            obj[keys[0]].push(item);
                                                         }
                                                        })
                                                    })

                                                    setAlltallydata(tallyArrayObj);
            }
            else{
              let tempArr=[];
                                let tempObj ={};

                                props.trandata[0].ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE.pop();
                                 let exportData = props.trandata[0].ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE;
                                                 exportData.map(item=>{
                                                     if(item.VOUCHER[0].ISCANCELLED !='Yes' && item.VOUCHER[0].$.VCHTYPE==props.optionvalue){
                                                         let tempObj={};
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

                                                 })
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

                                                         if(item.vouchertype==keys[0]&&keys[0]==props.optionvalue){
                                                            obj[keys[1]] += Number(item.amount);
                                                            obj[keys[0]].push(item);
                                                         }
                                                        })
                                                    })
                                                    tallyArrayObj.map(item=>{
                                                        Object.keys(item).map(key=>{
                                                            if(key==props.optionvalue){
                                                                tallyAppArr.push(item)
                                                            }
                                                        })
                                                        setInditallydata(tallyArrayObj);
                                                    })

                                                }

        }
       }, [props.trandata[0]]);

       useEffect(() => {

          let tempArr=[];
          let tempArr2=[];
          if(props.optionvalue==='All'){
           gsAlltallydata.map(item=>{
                  Object.keys(item).map(element=>{
                     if(element!=='amount'){
                         tempArr.push(item[element].length);
                      }else{
                         tempArr2.push(item.amount);
                      }
                  })
                 })

                 setTimeout(()=>{
                    setIteratingArray(tempArr);
                    setIteratingAmountArray(tempArr2);

                },0)

          }else{
            let tempArr = [];
            let tempAmount = 0;
            indiTallydata.map(item=>{

                Object.keys(item).map(element=>{

                    if(element===props.optionvalue){
                        if(item[element].length>0){
                           tempArr.push(element);
                            tempArr.push(item[element].length);
                            item[element].map(amt=>{
                               tempAmount += Number(amt.amount);
                            })
                            tempArr.push(tempAmount);
                        }
                    }
                })
            })
            setTimeout(()=>{
                setIteratingindividualArray(tempArr)
            },500)
           }

          }, [gsAlltallydata,indiTallydata])



            useEffect(() => {

                setTimeout(()=>{
                    setAlltallydata([]);
                },0);
                setTimeout(()=>{
                    setIteratingindividualArray([]);
                },0)
            }, [props.optionvalue]);



    return (
        <div >
             <h2>Tally App</h2>
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
            iteratingindividualArray.length>0 ?
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


                        { props.tallyMissingVouchers.length >0  && props.optionvalue !=="All" ?
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
                    {props.tallyMissingVouchers.map( item => {
                        return (
                            <tr key={item._id}>
                            <td>{item.vouchernumber}</td>
                            <td>{item.tallyid}</td>
                            <td>{item.vouchertype}</td>
                            <td>{item.amount}</td>
                            <td>{item.date}</td>
                            <td><button className="btn btn-primary">Details</button>|<button className="btn btn-primary">Resync</button></td>
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

export default Tally;
