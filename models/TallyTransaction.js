const mongoose = require('mongoose');

const Schema = mongoose.Schema

const tallySchema = new Schema({
    vouchertype:{
        required:true,
        type:String
    },
    tallyid:{
        required:true,
        type:String
    },
    amount:{
        required:true,
        type:Number
    },
    vouchernumber:{
        required:true,
        type:String
    },
    date:{
        required:true,
        type:Date
    },
    cancelflag:{
        default:false,
        type:Boolean
    }
})

const TallyMaster = mongoose.model('Transaction', tallySchema);

module.exports = TallyMaster;