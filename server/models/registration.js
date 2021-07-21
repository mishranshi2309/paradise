const mongoose = require("mongoose")
 const regSchema =  mongoose.Schema({
     _id:mongoose.Schema.Types.ObjectId,    //autoincrement_id
    username:{type:String, require:true},
    password : {type:String, require:true},
    email :{type:String , require:true},
    role :{type:String , require:true}
 },
 { collection: 'registration' }
 );

module.exports = mongoose.model('registration', regSchema);