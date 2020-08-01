const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const Reconcilerouter = require('./routes/Reconcileroute');
const CancelRouter = require('./routes/CancelTransaction');
const DeleteRouter = require('./routes/DeleteTransaction');
const PayrollCreationRouter = require('./routes/PayrollCreation');
const PayrollDisburseRouter = require('./routes/Disbursepayroll');
const CancelPayrollRouter = require('./routes/CancelPayroll');
const ApproveBatchPayroll = require('./routes/ApproveAll');
app.use(cors());
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//setup public folder

app.use(express.static('./public'));

const port = 5050;

app.use('/',Reconcilerouter);
app.use('/',CancelRouter);
app.use('/',DeleteRouter);
app.use('/',PayrollCreationRouter);
app.use('/',PayrollDisburseRouter);
app.use('/',CancelPayrollRouter);
app.use('/',ApproveBatchPayroll);

mongoose.connect('mongodb://localhost/tallyapp2',{useUnifiedTopology:true,useNewUrlParser:true},(err)=>{
    if(!err){
        console.log('DB connected successfully!!!!')
    }else{
        console.log(err);
    }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));