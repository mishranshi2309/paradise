const nodemailer = require('nodemailer');
module.exports.mailer = function(recemail,password,usermail, time , date ){
       
var transporter = nodemailer.createTransport({
    // host:'smtp.gmail.com',
    // port : 587,
    // secure:false,
    // requireTLS:true,
    service:'gmail',
    auth:{
        user:'paradiseliving2303@gmail.com',
        pass:"Ani23@Dha03"
    }
});
var mailOptions={
    from: "paradiseliving2303@gmail.com",
    to: recemail,
    subject: "Video MEET",
    text:"Hii ,  \n I am interested in your property . Will be waiting for you to come online on Video call at "+time+" on "+ date +"\n Password : " +password+"\n Thanks and Regard, \n "+usermail
}


transporter.sendMail(mailOptions,function(error, info){
    if(error){
        console.log(error);
    }
    else{
        console.log("succesfully sent...");
    }
})
}
