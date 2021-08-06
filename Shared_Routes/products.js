const express = require("express");
const router = express.Router();
const mongodb = require("../db/mongo");

const { productvalidation } = require("../models/productsvalid")
const { ObjectId } = require("mongodb");

router.post("/products", async (req, res) => {

    if (!req.user.role) {

        res.json({ result: "error", message: "Access Denined" })

    }

    else {

        const { error } = await productvalidation(req.body);
        if (error) {
            res.send({ result: "error", message: error.details[0].message })

        }

        else {

            const product = await mongodb.db.collection("products").findOne({$or: [{ ProductName: req.body.ProductName } , {Barcode:req.body.Barcode}]})
            if (product) {
                res.json({ result: "error", message: "Product Name / Barcode Already  Exist" })


            }

         
            else {
                req.body.createdBy = req.user._id;
                const { data } = await mongodb.db.collection("products").insertOne(req.body);

                res.json({ result: "Success", message: "Product Details Added Successfully" })

            }
        }
    }

})

router.get("/products" ,async (req ,res ) => {


    const data = await mongodb.db.collection("products").find().toArray();
res.send(data);
   
})

router.get("/products/:id" , async (req, res) =>{

    const  data  = await mongodb.db.collection("products").findOne({_id:ObjectId(req.params.id)});

    res.send(data);
})  

module.exports = router;