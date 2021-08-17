const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mongo = require("./db/mongo");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");


const auth_user = require("./Shared_Routes/auth_User");
const Usermanagement = require("./Shared_Routes/userManagement");
const auth_employee = require("./Shared_Routes/auth_employee");
const products = require("./Shared_Routes/products");
const customer = require("./Shared_Routes/Customer");
const invoice = require("./Shared_Routes/stockInvoice");
const dashboard = require("./Shared_Routes/dashboard");

async function loadApp(){
    try
    {

mongo.connect();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, 
    Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
  })
app.use(cors({
    origin: [
    
    'https://611b695616baaaf7993dff79--infallible-hodgkin-1c6bb3.netlify.app'
    
  ],
  credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use('/' , auth_user);

app.use( (req,res,next) => {

const token = req.cookies.access_token;

if (!token) {
    return res.sendStatus(403);
  }
else{
try{

    const user = jwt.verify(token, process.env.TOKEN_SECRET);

    if(user){
     req.user = user;
        next();
    }
   
}
catch(err){
    res.redirect('https://infallible-hodgkin-1c6bb3.netlify.app/login')
    res.json({error: err} )
}
}
})

app.use('/' , auth_employee);
app.use('/' ,Usermanagement );
app.use('/' ,products );
app.use('/' ,customer );
app.use('/' ,invoice );
app.use('/', dashboard);


const port = process.env.PORT || 7000;
app.listen(port , () =>console.log(`Application started at the port ${port}`));

    }

catch(err)
{

console.log(err);
console.log("error conecting to port");

}
}


loadApp(); 
