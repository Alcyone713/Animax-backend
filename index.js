const express = require("express");
const mongoose = require("mongoose")
require('dotenv').config()
const cors= require("cors")
require("./Models/User.js")
require('dotenv').config()

const app = express();
app.use(cors())
const PORT = process.env.PORT ||5000;
mongoose.model("User")

app.get('/', (req, res)=>{
    res.send("Hello")
})

app.use(express.json());
app.use(require('./Routes/auth.js'))
app.use(require('./Routes/lists.js'))

console.log(process.env)
mongoose.connect( process.env.MONGODB_URI );
mongoose.connection.on('connected', () => {
    console.log("Connected to MongoDB");
})
mongoose.connection.on('error', (err) => {
    console.log(err);
})

app.listen(PORT, () => {
    console.log("App is running")
})
