const express = require('express');
const mongoose = require('mongoose');
const redis = require('./utility/redis')
require('dotenv').config()
const bodyParser = require('body-parser')

const app = express();
const PORT = process.env.PORT || 3010;



mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on('open', function(){
    console.log('connection successful with MongoDB')
})



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



//routes

const shortCodes = require('./routes/shortCode')

app.use('/', shortCodes);

app.listen(PORT, ()=>{
    console.log(`SERVER STARTED ON PORT ${PORT}`)
})

