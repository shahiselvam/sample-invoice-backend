const express = require("express");
const router = express.Router();
const mongodb = require("../db/mongo");

router.get("/userDetailsCount" , async (req, res) => {
    
    const data = await mongodb.db.collection("userDetails").estimatedDocumentCount();
    res.status(200).send(data.toString());

 
  });
  router.get("/CustomerCount" , async (req, res) => {
    
    const data = await mongodb.db.collection("customer").estimatedDocumentCount();
    res.status(200).send(data.toString());

 
  });

  router.get("/InvoiceCount" , async (req, res) => {
    
    const data = await mongodb.db.collection("stockInvoice").estimatedDocumentCount();
    res.status(200).send(data.toString());

 
  });
  module.exports = router;