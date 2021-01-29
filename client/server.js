const express = require('express');
const app = express();
const cors = require('cors');
const request = require('request');
const mongoose = require('mongoose');
const CredentialMaster = require('./models/CreateSid');
const { OAuth2Client } = require('google-auth-library');
let client = new OAuth2Client('485008776010-mj3o94klbaj6kq2885u72lft8v999p7s.apps.googleusercontent.com');
app.use(cors());
app.use(express.json());

const port = 7045;

const googleAuth = async (token)=>{
    const ticket = await client.verifyIdToken({
        idToken:token,
        audience:'485008776010-mj3o94klbaj6kq2885u72lft8v999p7s.apps.googleusercontent.com'
    })
    const payload = ticket.getPayload();
    console.log(`user ${payload.name} is verified`);
    const { sub,email,name,picture } = payload;
    const userId = sub;
    return { userId,email,fullname:name,pictureurl:picture}
}

app.post('/handleuser',async (req,res)=>{
    console.log(req.body.data);
    var result=await googleAuth(req.body.data);
    res.send(result);
})

app.post('/createtemplates',async (req,res)=>{
    try{
        CredentialMaster.find().exec().then(result=>{
            if(result.length>0){
                console.log(`result is ....${result}`);
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
                        return res.status(500).send({message:"failure",data:JSON.stringify(error)})
                    }else{
                        console.log(`body is ${JSON.stringify(body,null,2)}`)
                        if(body.error)  return res.status(200).send({message:"failure",data:body.error.message})
                        return res.status(200).send({message:"success",data:body});
                    }
                    });
            }
        }).catch(err=>console.log(err));
    }catch(error){
        console.log(error);
    }

})

app.post('/setcredentials',async (req,res)=>{
    console.log(req.body);

    try{
        let { sid,token,email } = req.body;
        const tokenHead = new CredentialMaster({ sid,token,email });
        const saveddata = await tokenHead.save().then(response=>{
            res.send(response)
        }).catch(err=>{
            console.log(err);
        })

    }catch(error){
        console.log(error);
    }
})

mongoose.connect('mongodb://localhost/karixtemplatecreation',{useUnifiedTopology:true,useNewUrlParser:true},(err)=>{
    if(!err){
        console.log('DB connected successfully!!!!')
    }else{
        console.log(err);
    }
});

app.listen(port,()=>console.log(`app is running on port ${port}`));

