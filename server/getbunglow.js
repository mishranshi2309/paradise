const Property=require('./models/uploadfile'); 
 
 
const getBunglows=(req,res)=>{ 
 
 Property.find({cate:'Bunglow'}) 
 .then(result=>{ 
 console.log('result: ',result) 
 res.send(result.length>0?result:'No Propertys'); 
 }) 
 .catch(err=>{ 
 console.log(err); 
 }) 
} 
 
module.exports={ 
 getBunglows 
} 