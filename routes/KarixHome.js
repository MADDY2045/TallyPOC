const express = require('express');
const router = express.Router();
const axios = require('axios');


const username = '2ecc6220-e7a1-4dc4-9928-4a78b990e407';
const password = '4667110b-67a1-4b98-a3dd-7045ac56c796';
const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
const url = 'https://api.karix.io/message/';
const url2 = 'https://api.karix.io/message/';
// const data = {
// "channel": "whatsapp",
// "source": "+13253077759",
// "destination": [
// "+919894948839"
// ],
// "content": {
// "text": "Hey, Rick. It's Rick."},
// "events_url": "https://events.example.com/message"
// }

router.post("/sendmessage",async (req,res)=>{
    // console.log(req.body);
    await axios({url,method:'POST',headers:{ContentType: 'application/xml',charset:'UTF-8', 'Authorization': `Basic ${token}`},data:req.body})
        .then(response=>{
            res.send(response.data);
            console.log('--------response is-----------')
            console.log(response.data);
            console.log(':::errormsg:::');
            console.log(response.data.objects[0].error);
          }).catch(err=>{
            console.log('-------error-----------')
            console.log(err.response)
          });

    })

router.post('/geteventcallback',(req,res)=>{
    res.send(req.body)
   // console.log('callback response',req.body,req.body.uid);

})

router.post('/receiveinboundmessage',(req,res)=>{
    console.log('inbound message',req.body);
})

router.get('/getdetails',(req,res)=>{
//    axios({url2,method:'GET',headers:{ContentType: 'application/json',charset:'UTF-8', 'Authorization': `Basic ${token}`}})
//         .then(response=>{
//             res.send(response.data);
//           }).catch(err=>console.log(err));
axios.get(
    url2,
    {headers: {
        ContentType: 'application/json',charset:'UTF-8', 'Authorization': `Basic ${token}`
      }
    }
  )
  .then((response) => {
      var response = response.data;
    //   console.log(response)
      res.send(response)
    },
    (error) => {
      var status = error.response.status
    }
  );
})



module.exports = router;