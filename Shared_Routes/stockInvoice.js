const express = require("express");
const router = express.Router();
const mongodb = require("../db/mongo");
const { salesValidation } = require("../models/salesvali");
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");



router.post("/Invoice" , async (req , res) => {
    const userRole = req.user.role;
    if(!req.user.role){

        res.json({ result: "error", message: "Access Denined" })
    }

    else{

        const { error } = await salesValidation(req.body);

        if (error) {

            res.json({ result: "error", message: error.details[0].message })
        }

        else{

       const UserRights = await mongodb.db.collection("userRights").findOne({$and:[{User_Id : req.user._id} , {Create:true}] })
      if(UserRights ||  userRole == "manager"){
      
        req.body.createdby = req.user._id;
        const { data } = await mongodb.db.collection("stockInvoice").insertOne(req.body);

        const smtpTransport = nodemailer.createTransport({

          service: 'Gmail',
          auth: {
            user: 'shahiselvam21@gmail.com',
            pass: 'shahi123'
  
          }

      });

      const mailOptions = {

          to:req.user.email,
          from:'shahiselvam21@gmail.com',
          subject: 'Sales Invoice',
          text: 
               'One New Invoice Created' 
              
           };
           smtpTransport.sendMail(mailOptions, () => {
            
            console.log("Email Send To User")
           });

           const mailOptions1 = {

            to:req.body.CustomerEmail,
            from:'shahiselvam21@gmail.com',
            subject: 'Sales Invoice',
            text: 
                 'Thank You for your Purchase' 
                
             };
             smtpTransport.sendMail(mailOptions1, () => {
              
             console.log("Email Send To Client")
             });
  
             res.json({ result: "Success", message: "Sales Invoice Created Successfully", data })
 
      }

      else{

        res.json({ result: "error", message: "Access Denined" })
      }

    }
    }    
})

router.get("/Invoice" ,  async (req , res) => {

    if(!req.user.role){

        res.json({ result: "error", message: "Access Denined" })
    }

    else{

      const data  = await mongodb.db.collection("stockInvoice").find().toArray();
      res.json(data);
     
    }

})


router.get("/Invoice/:id" ,  async (req , res) => {

  if(!req.user.role){

      res.json({ result: "error", message: "Access Denined" })
  }

  else{
    const userRole = req.user.role;

    const UserRights = await mongodb.db.collection("userRights").findOne({$and:[{User_Id : req.user._id} , { View:true }] })
  
if( UserRights || userRole == "manager"){

  const data  = await mongodb.db.collection("stockInvoice").findOne({_id:ObjectId(req.params.id)})
  res.json(data);
}

else{

  res.json({ result: "error", message: "Access Denined" })
}
    
  
  }

})

router.delete("/StockInvoice/:id" , async (req , res) => {

  if(!req.user.role){
console.log(req.user.role)
    res.json({ result: "error", message: "Access Denined" })
}

else{
  const userRole = req.user.role;

  const UserRights = await mongodb.db.collection("userRights").findOne({$and:[{User_Id : req.user._id} , { Delete:true }] })

if( UserRights || userRole == "manager"){

const data  = await mongodb.db.collection("stockInvoice").deleteOne({_id:ObjectId(req.params.id)})

res.json({result:"Success" ,message:"Invoice Deleted Succesfully" ,  data});
}

else{

res.json({ result: "error", message: "Access Denined" })
}
  

}


})

module.exports = router;