const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const payHeadSchema = new Schema({
    payhead:{
        type:String,
        required:true
            },
    type:{
        type:String,
        required:true
    }
})

const PayHeadMaster = mongoose.model('payhead', payHeadSchema);

module.exports = PayHeadMaster;