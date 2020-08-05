const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const KarixWhatsappRouter = require('./routes/KarixHome');

app.use(cors());
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//setup public folder

app.use('/',KarixWhatsappRouter);

app.use(express.static('./public'));

const port = 6050;

mongoose.connect('mongodb://localhost/karixwhatsapp',{useUnifiedTopology:true,useNewUrlParser:true},(err)=>{
    if(!err){
        console.log('DB connected successfully!!!!')
    }else{
        console.log(err);
    }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));