'use strict'

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(cors());



//app.use('/api');

module.exports = app;