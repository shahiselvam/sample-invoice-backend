const express = require("express");
const router = express.Router();
const mongodb = require("../db/mongo");
const { customervalidation } = require("../models/customervalidation")

const { ObjectId } = require("mongodb");
router.post("/customer", async (req, res) => {

    if (!req.user.role) {


        res.json({ result: "error", message: "Access Denied" });


    }
    else {

        const { error } = await customervalidation(req.body);

        if (error) {

            res.json({ result: "error", message: error.details[0].message })
        }

        else {

            const customer = await mongodb.db.collection("customer").findOne({ $and: [{ CustomerName: req.body.CustomerName }, { Phone: req.body.Phone }] })
            if (customer) {

                res.json({ result: "error", message: "customer already exist" })
            }

            else {
                req.body.createdby = req.user._id;
                const { data } = await mongodb.db.collection("customer").insertOne(req.body);
                res.json({ result: "Success", message: "Customer Added Successfully", data })
            }
        }

    }
})


router.get("/customer" ,async (req, res) =>{

const data = await mongodb.db.collection("customer").find().toArray();

res.json(data);

})


router.get("/customer/:id" , async (req, res) =>{

    const  data  = await mongodb.db.collection("customer").findOne({_id:ObjectId(req.params.id)});

    res.send(data);
})  
module.exports = router;