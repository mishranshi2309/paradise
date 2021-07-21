const mongoose = require("mongoose")
 const plSchema =  mongoose.Schema({
     _id:mongoose.Schema.Types.ObjectId,    //autoincrement_id
    fname:{type:String, require:true},
    email : {type:String, require:true},
    subject :{type:String , require:true},
    message :{type:String , require:true},
    date:{type:Date , require:true},
 },
 { collection: 'contactmail' }
 );

module.exports = mongoose.model('paradiseliv', plSchema);
