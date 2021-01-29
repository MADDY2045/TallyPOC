const express = require('express');
const app = express();
const cors = require('cors');
const request = require('request');

app.use(cors());
app.use(express.json());

const port = 7045;

app.post('/createtemplates',(req,res)=>{
    console.log(req.body.inputsValue);
    let url = 'https://2ecc6220-e7a1-4dc4-9928-4a78b990e407:4667110b-67a1-4b98-a3dd-7045ac56c796@api.karix.io/whatsapp/template/'
    let urlstring={
        url:url,
        method:'POST',
        json:true,
        body:req.body.inputsValue
    }
    request(urlstring, function (error, response, body) {
        if (error){
            console.log(`error is ${JSON.stringify(error,null,2)}`)
            //if(error.data.message) return res.status(500).send({message:"failure",data:JSON.stringify(error.data.message)});
            return res.status(500).send({message:"failure",data:JSON.stringify(error)})
        }else{
            console.log(`body is ${JSON.stringify(body,null,2)}`)
            if(body.error)  return res.status(200).send({message:"failure",data:body.error.message})
            return res.status(200).send({message:"success",data:body});
        }
        });
})

app.listen(port,()=>console.log(`app is running on port ${port}`));

