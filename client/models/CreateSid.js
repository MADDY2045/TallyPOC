const mongoose = require('mongoose');

const Schema = mongoose.Schema

const SidSchema = new Schema({
    sid:{
        required:true,
        type:String
    },
    token:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String,
        unique: true
    }
})

const CredentialsMaster = mongoose.model('credential', SidSchema);

module.exports = CredentialsMaster;