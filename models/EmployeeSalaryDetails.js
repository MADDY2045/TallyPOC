const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const employeeSalary = new Schema({
    account:{
        type:String
        },
    date:{
        type:Date
        },
    id:{
        type:String
        },
    ifsc:{
        type:String
        },
    instrumentdate:{
        type:String
        },
    instrumentnumber:{
        type:String
        },
    name:{
        type:String
        },
    payhead:{
        type:Array,
        default:[]
    },
    role:{
        type:String
        },
    transactiontype:{
        type:String
        },
    tallyid:{
        type:String,
        default:null
    }

})

const employeeSalaryDetails = mongoose.model('employeesalary', employeeSalary);

module.exports = employeeSalaryDetails;