const nodemailer = require('nodemailer');
module.exports.mailer = function(name, mail ,subj , msg){
    
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
    from: mail,
    to: 'paradiseliving2303@gmail.com',
    subject: subj,
    text:"HII ,  \n "+msg+" \n Thanks and Regard, \n"+name+"\n "+mail
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
