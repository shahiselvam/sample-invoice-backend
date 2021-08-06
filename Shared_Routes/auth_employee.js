const express = require("express");
const router = express.Router();
const {registervalidation} = require("../models/user");
const mongodb = require("../db/mongo");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { ObjectId } = require("mongodb");

router.post("/employeeRegistration" , async (req, res) => {
if(req.user.role == "manager"){

const { error } = await registervalidation(req.body);
    if(error){
        res.send({result: "error" , message : error.details[0].message})
        
    }

    else{

        const user = await mongodb.db.collection("userDetails").findOne({email : req.body.email });
        
        if(user){
            res.send({result:"error" , message:"Email Already Exist"});
         
      }

      else{

        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        req.body.confirmpassword = await bcrypt.hash(req.body.password, salt);

        const buf = crypto.randomBytes(20);
        const token = buf.toString('hex');

        const data={
           FirstName:req.body.FirstName,
           LastName:req.body.LastName,
           email:req.body.email,
           password:req.body.password,
           role:req.body.role,
           Activatetoken:token
          

        }

        await mongodb.db.collection("userDetails").insertOne(data);
         

            const smtpTransport = nodemailer.createTransport({

                service: 'Gmail',
                auth: {
                  user: 'email',
                  pass: 'password'
        
                }

            });

            const mailOptions = {

                to:req.body.email,
                from:'email',
                subject: 'Node.js Account Activation',
                text: 
                     'Please click on the following link, or paste this into your browser to Activate your account:\n\n' +
                     'http://' + req.headers.host + '/activate/' + token + '\n\n'  
                 };
                 smtpTransport.sendMail(mailOptions, () => {
                   console.log( 'Registered  Succesfully Account A activation e-mail has been sent to ' + req.body.email );
                   
                 });
           
                 res.send({result: "success" , message : `'Registered  Succesfully Account A activation e-mail has been sent to ' + ${req.body.email}  ` })     
            }
    
    }
}
else{

    res.send({result:"error" , message:"Access Denied"})
}
})


router.get("/activate/:token" , async (req, res) => {
  
    const user = await mongodb.db.collection("userDetails").findOne({Activatetoken: req.params.token});
   
    if(!user){
    
        
        res.send({result: "error" , message : "Activation token is invalid" })
    }

    else{

        const data={
            FirstName:user.FirstName,
            LastName:user.LastName,
            email:user.email,
            password:user.password,
            role:user.role,
            Activatetoken:undefined,
            Active:true
           

         }
         await mongodb.db.collection("userDetails").findOneAndUpdate({_id:user._id}, {$set :data })
        res.send({result: "Success" , message : "Account Activated" })
    }

    })

    module.exports = router;