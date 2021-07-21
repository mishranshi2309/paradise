const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require('multer');
const cors = require("cors");
require('dotenv').config();
const PORT = require('../server/env.js');
//const bodyparser = require("body-parser");
const Pl = require("./models/paradiseliv");
const Reg = require("./models/registration");
const Uf = require("./models/uploadfile");
const app = express();
const fs = require('fs');
const router = express.Router();
const mail = require('./mailer.js');
const vc = require('./videocall.js');
const { getBunglows } = require("./getbunglow");
const server = require('http').Server(app)
const io = require('socket.io')(server)
const  compress = require('lz-string')
const { v4: uuidV4 } = require('uuid')
const {gzip, ungzip} = require('node-gzip');
const { default: axios } = require("axios");
const FormData = require('form-data');
app.use('/uploads', express.static('uploads'));
const fileUpload = require('express-fileupload');
const { ppid } = require("process");
const {localStorage} = require("node-localstorage");

//db connection
//db name: paradiseliving 
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/paradiseliving', { useNewUrlParser: true, useUnifiedTopology: true })
//mongoose.connect('mongodb+srv://paradiseliving:dhavalani@cluster0.jk2jf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{ useNewUrlParser: true ,useUnifiedTopology: true })
mongoose.connection.on('connected', () => {
  console.log("database connected");
})
mongoose.connection.on('error', () => {
  console.log("error");
})

mongoose.set('useFindAndModify', false);


//middlewares
app.use(cors());

app.use(express.json())
//routes
app.get('/', (req, res) => {
  Pl.find()
    .exec()
    .then(result => {
      res.send(result);
    })
})
app.post('/about', (req, res) => {
  // res.send("hiiss");
  console.log(req.body.fname);
  console.log(req.body.email);
  console.log(req.body.subject);
  mail.mailer(req.body.fname, req.body.email, req.body.subject, req.body.message);
  const pl = new Pl({
    _id: new mongoose.Types.ObjectId,
    fname: req.body.fname,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
    date: new Date()
  });
  pl.save()
    .then(result => {
      console.log(result);
      res.status(200).json({ msg: "succesfully submitted" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: "error occured" });
    })
  res.send('ok');

})

//registration

app.post('/signup', (req, res) => {
  // res.send("hiiss");
  console.log(req.body.username);
  console.log(req.body.email);
  console.log(req.body.password);

  Reg.findOne({username: req.body.username}).then((userExist)=>{
    if(userExist){
      return res.status(422).json({error: "Email already exist!!"});
    }
  
  const reg = new Reg({
    _id: new mongoose.Types.ObjectId,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    role: req.body.role,
  });
  reg.save()
    .then(result => {
      console.log(result);
      res.status(200).json({ msg: "succesfully submitted" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: "error occured" });
    })
})
})

//  app.get('/login/:username/:password', (req,res)=>{
//     const username = req.params.username;
//     const password = req.params.password;
//     console.log(username,password);
//     Reg.findOne({$and:[{username:username},{password:password}]})
//     .then(result=>{
//         if(!result){
//             return res.status(404).json({
//                  msg: "not found" 
//               });
//               console.log("value fetched"+ result);
//         }else{
//         res.send(result);
//         console.log("value fetched"+ result);
//         }
//     })
//  })

app.use(express.json({limit: '100mb'}));

app.post('/login', async (req, res) => {
  //res.send("thanks");
  try {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);
    const userLogin = await Reg.findOne({ username: username, password: password });
    console.log("helloo" + userLogin);
    
    // Reg.find({username:username})
    // .exec()
    // .then(result=>{
    //     res.send("thanks"+result);
    // });
    if (!userLogin) {
      res.status(400).json({ error: "invalid credentials" });
    }
    else {
      res.json({
          message: "successfully login" });
    }
  } catch (err) {
    console.log(err);
  }
})




// IMAGE UPLOAD
app.use('/uploads', express.static(path.join(__dirname, 'upload')))
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() )
  }
})

const fileFilter = (req, file, cb) => {
  cb(null, true);
}

var upload = multer({ storage: storage, fileFilter: fileFilter })

app.use(fileUpload())
app.post('/uploadfile', (req, res) => {
   console.log("hiii filess");
    
  //  console.log(req.body.fileName, req.body.area, req.body.address, req.body.costpersq);
   console.log(req.files);
   let fileId = req.files.fileName;
   console.log(fileId)
   fileId.mv('../client/client/public/uploads/'+fileId.name, function(err){
     if(err){
       console.log("file not uploaded")
     }else{
      console.log(fileId);
      const file = new Uf({ 
        _id: new mongoose.Types.ObjectId,
        fileName: fileId.name,
        area: req.body.area,
        address: req.body.address,
        costpersq: req.body.costpersq,
        city: req.body.city,
        district: req.body.district,
        state: req.body.state,
        info: req.body.info,
        status: req.body.status,
        cate: req.body.cate,
        agentmail:req.body.agentmail,
        sellerName:req.body.sellerName,
        extrafacility:req.body.extrafacility,
        houseFacing:req.body.houseFacing,
        floor:req.body.floor,
        bhk:req.body.bhk,
        contactNumber:req.body.contactNumber
      });
      file.save().then(result => {
        console.log(result);
        res.status(200).json({ msg: "succesfully submitted" });
    })
    .catch(err=>{
        console.log(err);
        result.status(500).json({msg:"error occured"});
    })
     }
   })
   
   
//   Uf.find()
//      .then(result => {
      
//       fileId = result.length+1;
//       const newFile = Date.now()+".txt";
//       console.log(newFile);
//       var writeStream = fs.createWriteStream("uploads/"+newFile);
//       console.log(writeStream);
//       writeStream.write(req.body.fileName);
//       writeStream.end();
//   console.log(req.body.costpersq);


 //})
})

app.get('/bunglow', (req, res) => {
  Uf.find({ cate: 'Bunglow' })
    .then(result => {
      console.log('result: ', result)
      res.send(result.length > 0 ? result : 'No Properties');
    })
    .catch(err => {
      console.log(err);
    })
  // getBunglows.getBunglows
});

app.get('/flat', (req, res) => {
  Uf.find({ cate: 'Flat' })
    .then(result => {
      console.log('result: ', result)
      res.send(result.length > 0 ? result : 'No Property');
    })
    .catch(err => {
      console.log(err);
    })
  // getBunglows.getBunglows
});

app.get('/rent', (req, res) => {
  Uf.find({ cate: 'Rent' })
    .then(result => {
      console.log('result: ', result)
      res.send(result.length > 0 ? result : 'No Property');
    })
    .catch(err => {
      console.log(err);
    })
  // getBunglows.getBunglows
});

app.get('/pg', (req, res) => {
  Uf.find({ cate: 'PG' })
    .then(result => {
      console.log('result: ', result)
      res.send(result.length > 0 ? result : 'No Property');
    })
    .catch(err => {
      console.log(err);
    })
  // getBunglows.getBunglows
});

app.post('/videocall',(req, res)=>{
  console.log("hiii");
  console.log(req.body.mailid, req.body.password  ,req.body.usermail, req.body.time, req.body.date)
  vc.mailer(req.body.mailid,req.body.password ,req.body.usermail, req.body.time, req.body.date);
})

app.get('/requestlist', (req, res) => {
  Pl.find()
    .exec()
    .then(result => {
     
      res.send(result);
    })
})
app.get('/propertylist', (req, res) => {
  Uf.find()
    .exec()
    .then(result => {
      res.send(result);
    })
})

app.get('/property/:id',(req,res)=>{
  const id = req.params.id;
  Uf.remove({_id:id} , (err, result)=>{
      if(err){
          console.log(err);
      }
      else{
          res.status(200).json({msg:"deleted succesfully"});
      }
  })
})

app.get('/custlist', (req, res) => {
  Reg.find()
    .exec()
    .then(result => {
      
      res.send(result);
    })
})

app.get('/agentlist', (req, res) => {
  Uf.find()
    .distinct("sellerName")
    .then(result => {
      
      res.send(result);
    })
})
app.get('/allproperty', (req, res) => {
  Uf.find()
    .then(result => {
      console.log('result: ', result)
      res.send(result.length > 0 ? result : 'No Properties');
    })
    .catch(err => {
      console.log(err);
    })
  // getBunglows.getBunglows
});

app.get('/getFileData/:id',(req,res)=>{  
  var readme = fs.readFileSync(`./uploads/${req.params.id}`, 'utf-8');
  res.send(readme);
})

app.post(`/editFile/:id`, (req,res)=>{
    var index = req.params.id;
    var area = req.body.status;

    console.log("--->", area);
    Uf.updateOne({_id: index}, { 
      $set:{
      area: req.body.area,
      address: req.body.address,
      costpersq: req.body.costpersq,
      city: req.body.city,
      district: req.body.district,
      state: req.body.state,
      info: req.body.info,
      status: req.body.status,
      cate: req.body.cate,
      agentmail:req.body.agentmail,
      sellerName:req.body.sellerName,
      extrafacility:req.body.extrafacility,
      houseFacing:req.body.houseFacing,
      floor:req.body.floor,
      bhk:req.body.bhk,
      contactNumber:req.body.contactNumber
      }
    },
    function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated User : ", docs);
    }
    
  })

})



app.listen(PORT);