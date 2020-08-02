const express = require('express');
const router = express.Router();
const axios = require('axios');
var parseString = require('xml2js').parseString;
const TallyMaster = require('../models/TallyTransaction');
var dateFormat = require('dateformat');





router.post('/posttransaction',(req,res)=>{
    try{
        const { vouchertype,tallyid,amount,vouchernumber,date } = req.body;


        TallyMaster.find({tallyid:tallyid}).exec().then(output=>{
            if(output.length>0){
                console.log('Tally id already exists!!!');
            }else{
                let formatdate = dateFormat(date,"yyyy-mm-dd");
                const newTransaction = new TallyMaster({vouchertype,tallyid,amount,vouchernumber,date:formatdate});
                const newTransactionDetails = newTransaction.save()
                .then(()=>{
                   console.log("saved successfully!!!");
                   res.end();
                }).catch(err=>{
                    res.status(404).send(err);
                })
            }
        }).catch(err=>console.log(err))


    }catch(error){res.send(error)}

})

router.get('/posttransaction',(req,res)=>{
    TallyMaster.find().exec().then(result=>{
        res.status(200).send(result);
    }

    ).catch(err=>console.log(err));
})

router.get('/getrecondetails/:id/:fromdate/:todate',getGsApp,(req,res)=>{

    const fortmattedfromdate= dateFormat(req.params.fromdate, "yyyymmdd");
    const fortmattedtodate= dateFormat(req.params.todate, "yyyymmdd");

    var xmlstring = `<ENVELOPE>
<HEADER>
<VERSION>1</VERSION>
<TALLYREQUEST>EXPORT</TALLYREQUEST>
<TYPE>DATA</TYPE>
<ID>Voucher Register</ID>
</HEADER>
<BODY>
<DESC>
<STATICVARIABLES>
<SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
<SVFROMDATE TYPE="Date">${fortmattedfromdate}</SVFROMDATE>
<SVTODATE TYPE="Date">${fortmattedtodate}</SVTODATE>
</STATICVARIABLES>
</DESC>
</BODY>
</ENVELOPE>`;

    let searchvoucher = req.params.id;
    if(searchvoucher === 'All'){
        try{
            axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlstring})
            .then(response=>{
                            parseString(response.data, (err, result)=>{

                                if(!err){
                                    let tempArr=[];
                                    let tempObj ={};

                                    result.ENVELOPE.BODY[0].DATA[0].TALLYMESSAGE.pop();
                                     let exportData = result.ENVELOPE.BODY[0].DATA[0].TALLYMESSAGE;
                                                     exportData.map(item=>{
                                                         if(item.VOUCHER[0] && item.VOUCHER[0]!==undefined && item.VOUCHER[0].ISCANCELLED !='Yes' && item.VOUCHER[0].$.VCHTYPE!=='Payroll' && item.VOUCHER[0].$.VCHTYPE!=='Attendance'){
                                                             let tempObj={};
                                                             tempObj['tallyid']=item.VOUCHER[0].MASTERID[0].trim();
                                                             tempObj['vouchernumber']=item.VOUCHER[0].VOUCHERNUMBER[0];
                                                             tempObj['vouchertype']=item.VOUCHER[0].$.VCHTYPE;
                                                             tempObj['date']=item.VOUCHER[0].DATE[0];

                                                                if(item.VOUCHER[0]['ALLINVENTORYENTRIES.LIST']){
                                                                    tempObj['amount']=item.VOUCHER[0]['ALLINVENTORYENTRIES.LIST'][0].AMOUNT[0]
                                                                }else if(item.VOUCHER[0]['ALLLEDGERENTRIES.LIST']){
                                                                   tempObj['amount']=item.VOUCHER[0]['ALLLEDGERENTRIES.LIST'][0].AMOUNT[0];
                                                                }else if(item.VOUCHER[0]['INVENTORYENTRIESIN.LIST'][0].AMOUNT[0]){
                                                                    tempObj['amount']=item.VOUCHER[0]['INVENTORYENTRIESIN.LIST'][0].AMOUNT[0];
                                                                }else{

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

                                                        let responseArray=[];


                                                        responseArray.push(tallyArrayObj);
                                                        responseArray.push(req.body);
                                                      return res.send(responseArray);
                                }


                                                })
                        }).catch(err=>console.log("Tally is not up"));

        }catch(error){console.log('error:::::::',error)}
    }else{
        try{

            axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlstring})
            .then(response=>{
                            parseString(response.data, (err, result)=>{
                                let tempArr=[];
                                let tempObj ={};

                                result.ENVELOPE.BODY[0].DATA[0].TALLYMESSAGE.pop();
                                 let exportData = result.ENVELOPE.BODY[0].DATA[0].TALLYMESSAGE;
                                                 exportData.map(item=>{
                                                     if(item.VOUCHER[0].ISCANCELLED !='Yes' && item.VOUCHER[0].$.VCHTYPE==searchvoucher){
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

                                                         if(item.vouchertype==keys[0]&&keys[0]==searchvoucher){
                                                            obj[keys[1]] += Number(item.amount);
                                                            obj[keys[0]].push(item);
                                                         }
                                                        })
                                                    })
                                                    tallyArrayObj.map(item=>{
                                                        Object.keys(item).map(key=>{
                                                            if(key==searchvoucher){
                                                                tallyAppArr.push(item)
                                                            }
                                                        })


                                                    })

                                                    let GsAppArray = [];
                                                    req.body.map(item=>{
                                                        Object.keys(item).map(key=>{
                                                            if(key==searchvoucher){

                                                                GsAppArray.push(item)
                                                            }
                                                        })
                                                    })
                                                    //res.send(tallyAppArr);
                                                    const compareName = (obj1, obj2)=>{
                                                        return (obj1.tallyid === obj2.tallyid);
                                                      }
                                                      let output1=[];
                                                      let output2=[];

                                                        output1 = tallyAppArr[0][searchvoucher].filter(b=>{
                                                            let indexFound = GsAppArray[0][searchvoucher].findIndex(a => compareName(a, b));
                                                            return indexFound == -1;
                                                          })

                                                         output2 = GsAppArray[0][searchvoucher].filter(b=>{
                                                            let indexFound = tallyAppArr[0][searchvoucher].findIndex(a => compareName(a, b));
                                                            return indexFound == -1;
                                                          })

                                                    //res.send(missingVoucher);
                                                    let responseArray=[];
                                                    let vouchername ={};
                                                    let missingobj={}
                                                    missingobj['missingvoucherone'] =[]
                                                    missingobj['missingvouchertwo'] =[]

                                                    responseArray.push(tallyAppArr[0]);
                                                    responseArray.push(GsAppArray[0]);

                                                    missingobj['missingvoucherone'].push(output1);
                                                    missingobj['missingvouchertwo'].push(output2);
                                                    responseArray.push(output1);
                                                    responseArray.push(output2);
                                                    res.send(responseArray)
                                                    //res.render('pages/recon',{table:tallyAppArr,table2:GsAppArray,message:true,vouchername:searchvoucher,missingvouchertally:output1,missingvouchergs:output2});
                                                })
                        }).catch(err=>console.log("connection error is ::::",err));

        }catch(error){console.log('error:::::::',error)}

    }
})

function getGsApp(req,res,next){

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
    axios.get('http://localhost:5050/posttransaction').then(response=>{
      tempArr2=response.data;
      tempArr2.map(item=>{

          comparedate = new Date(item.date);
          if(item.cancelflag===false ){
            GsAppObj.map(obj=>{
                let keys=Object.keys(obj);
                let compareitemdate = new Date(dateFormat(item.date,'mm/dd/yyyy')).getTime();
                let comparefromdate = new Date(dateFormat(req.params.fromdate,'mm/dd/yyyy')).getTime();
                let comparetodate = new Date(dateFormat(req.params.todate,'mm/dd/yyyy')).getTime();


                if(item.vouchertype==keys[0] ){
                    if(compareitemdate >= comparefromdate && compareitemdate <= comparetodate){
                        obj[keys[1]] += Number(item.amount);
                        obj[keys[0]].push(item);
                    }else{
                        console.log("not valid date entry");
                    }
                  }
               })
          }
        })
       req.body = GsAppObj;
       next();
    }).catch(err=>console.log(err));

}



module.exports = router;