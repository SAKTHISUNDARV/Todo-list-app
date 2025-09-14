const express =require("express");
const exphbs=require("express-handlebars");
const bodyparser=require("body-parser");
const mysql=require("mysql");

require('dotenv').config();

const app=express();
const port=process.env.PORT || 5000;

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.listen(port,()=>{
    console.log("Listening port : "+port);
})