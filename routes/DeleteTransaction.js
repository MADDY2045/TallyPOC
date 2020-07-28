const express = require('express');
const router = express.Router();
const axios = require('axios');
const TallyMaster = require('../models/TallyTransaction');


router.delete('/deletegsdata/:id/:vouchertype/:date/:vouchernumber',(req,res)=>{
    console.log("entered route ",req.params.id,req.params.vouchertype,req.params.date,req.params.vouchernumber);
    TallyMaster.findOneAndDelete({tallyid:req.params.id}).then(result=>{
        try{
           if(result){
                res.send("successful");
                }
        }catch(error){console.log('error',error)}

    }).catch(err=>console.log(err))
})

module.exports = router;