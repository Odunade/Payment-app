// config file
require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const bodyParser = require('body-parser');
const database = require ("./config/database");
const cors = require('cors')
  
const port = process.env.PORT || 2023
 
//Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json())
app.use(cors())

//static page for testing api
app.use(express.static('public'));


//Listen to port 
var server = require('http').createServer(app)

//Routes
const router = require("./routes");
app.use('/api/user', router);

app.listen(port, ()=>{
    console.log("Backend is running")
})
