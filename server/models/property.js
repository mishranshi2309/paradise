const mongoose = require("mongoose")
 const propSchema =  mongoose.Schema({
     _id:mongoose.Schema.Types.ObjectId,    //autoincrement_id
    area:{type:Number, require:true},
    address : {type:String, require:true},
    costpersq :{type:Number , require:true},
    city :{type:String , require:true},
    district :{type:String , require:true},
    state :{type:String , require:true},
    info :{type:String , require:true},
    status :{type:String , require:true},
    cate :{type:String , require:true},
    
 },
 { collection: 'property' }
 );

module.exports = mongoose.model('property', propSchema);