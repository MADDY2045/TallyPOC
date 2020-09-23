const express = require('express');
const router = express.Router();
const axios = require('axios');
let Pusher = require('pusher');

const username = '2ecc6220-e7a1-4dc4-9928-4a78b990e407';
const password = '4667110b-67a1-4b98-a3dd-7045ac56c796';
const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
const url = 'https://api.karix.io/message/';
const url2 = 'https://api.karix.io/message/';

router.get('/',(req,res)=>{
    res.send("success!! working")
})

router.post('/sendnotification',async (req,res)=>{
    //console.log(req.body);
    // res.send("success");
    let smsArray = [];
    let whatsappArray = [];
        if(req.body.dataobj["enablesms"] === true){
            let smsdata = {}
            smsdata = {
                "channel": "sms",
                "source": "+13253077759",
                "destination": [`+91${req.body.dataobj["smsmobile"]}`],
                "content":{
                    "text":`${req.body.dataobj["body"]}`
                },
                "events_url": "https://bbcbc8aafd88.ngrok.io/geteventcallback"
                }
                smsArray.push(smsdata);
            }
        if(req.body.dataobj["enablewhatsapp"] === true){
            let whatsappdata = {}
            whatsappdata = {
                "channel": "whatsapp",
                "source": "+13253077759",
                "destination": [
                `${req.body.dataobj["whatsappmobile"]}`
                ],
                "content":{
                    "text":`${req.body.dataobj["whatsappbody"]}`
                },
                "events_url": "https://bbcbc8aafd88.ngrok.io/geteventcallback"
                }
                whatsappArray.push(whatsappdata);
            }


        let smsresult;
        let whatsappresult;
    if(smsArray.length > 0){
       smsresult = await sendSms(smsArray);
        setTimeout(()=>{
            console.log(`smsresult ${smsresult}`);
        },1000)

        }

    if(whatsappArray.length>0){
        whatsappresult = await sendWhatsapp(whatsappArray);
        setTimeout(()=>{
            console.log(`whatsappresult ${whatsappresult}`);
        },1000)
        }

        if(smsresult !== undefined || whatsappresult !== undefined){
            res.send({message:{sms:smsresult,whatsapp:whatsappresult}})
        }else{
            res.send("something went wrong");
        }

})

router.post('/geteventcallback',(req,res)=>{

   console.log('callback response',req.body,req.body.uid);
   let pusher = new Pusher({
    appId: "1076100",
    key: "dd4362aebc1d1cf00ed3",
    secret: "af7ccdba7b909702b8cc",
    cluster: "ap2"
});
if(req.body.data.channel==='sms'){
    pusher.trigger('notifications', 'sms', req.body.data.status, req.headers['x-socket-id']);
}
if(req.body.data.channel==='whatsapp'){
    pusher.trigger('notifications', 'whatsapp', req.body.data.status, req.headers['x-socket-id']);
}

//    setTimeout(()=>{
//     process.exit();
// },3000)
res.send(`req.body`)

})

module.exports = router;

function sendSms(smsArray){

    return axios({url,method:'POST',headers:{ContentType: 'application/xml',charset:'UTF-8', 'Authorization': `Basic ${token}`},data:smsArray[0]})
            .then(response=>{
                console.log('--------response is-----------')
                console.log(response.data.objects[0].status);
                console.log(':::errormsg:::');
                console.log(response.data.objects[0].error);
                // if(response.data.objects[0].error !== undefined){
                //     return "failure"
                // }
                if(response.data.objects[0].status !== 'failed'){
                    return "success"
                }else{
                    return "failure"
                }
               }).catch(err=>{
                console.log('-------error-----------')
                console.log(err);
                return "failure"
              });
}

function sendWhatsapp(whatsappArray){
    return axios({url,method:'POST',headers:{ContentType: 'application/xml',charset:'UTF-8', 'Authorization': `Basic ${token}`},data:whatsappArray[0]})
            .then(response=>{
                console.log('--------response is-----------')
                console.log(response.data.objects[0].status);
                // if(response.data.objects[0].error !== undefined){
                //     return "failure"
                // }
                if(response.data.objects[0].status !== 'failed'){
                    return "success"
                }else{
                    return "failure"
                }
              }).catch(err=>{
                console.log('-------error-----------')
                console.log(err);
                return "failure"
            });
}