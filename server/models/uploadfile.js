const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId, 
    fileName:{
        type:String
    },
    area:{type:Number, require:true},
    address : {type:String, require:true},
    costpersq :{type:Number , require:true},
    city :{type:String , require:true},
    district :{type:String , require:true},
    state :{type:String , require:true},
    info :{type:String , require:true},
    status :{type:String , require:true},
    cate :{type:String , require:true},
    contactNumber:{type:String, require:true},
    extrafacility:{type:String, require:true},
    houseFacing:{type:String, require:true},
    floor:{type:Number, require:true},
    bhk:{type:String, require: true},
    sellerName:{type:String, require: true},
    agentmail:{type:String, require: true}
},{collection: 'category'});

module.exports = mongoose.model('Uploadfile', uploadSchema);