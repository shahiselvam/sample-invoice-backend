
const express = require("express");
const router = express.Router();
const mongodb = require("../db/mongo");

const {rightsValidation} = require("../models/userMan")


router.get("/rights", async (req, res) => {

    
    if (req.user.role == "manager") {

        
        const data = await mongodb.db.collection("Rights").find().toArray();

        res.send(data);

    }

    else {

        res.send({ error: "Access Denined" });
    }

})

router.get("/userDetails" , async (req , res) => {
    if (req.user.role == "manager") {
        const data = await mongodb.db.collection("userDetails").find({$or:[{role : "admin" },{role : "employee"}], Active:true }).toArray();
         res.send(data);

    }   

    else {

        res.send({ error: "Access Denined " });
    }


})

router.post("/userRights" , async (req, res) => {

    if (req.user.role == "manager") {
    
        const { error } = await rightsValidation(req.body);
    if(error){
        res.send({result: "error" , message : error.details[0].message})
        
    }
   else{
   
       
    const user = await mongodb.db.collection("userRights").findOne({User_Id: req.body.User_Id })
    if(user)
    {
        res.json({result :"error" , message:"Rights Already assigned for this user"})
    }

    else
    {

       
      req.body.CreateBy = req.user._id;
      const { data } =   await mongodb.db.collection("userRights").insertOne(req.body);
      res.json({result :"success" , message:"UserRights Added Successfully" , data})

    }

}
}
else {

    res.json({ error: "Access Denined" });
}


})




module.exports = router;