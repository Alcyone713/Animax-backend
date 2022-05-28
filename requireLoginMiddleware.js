const jwt = require('jsonwebtoken')
const { JWT_KEY } = require('./keys.js')
const mongoose = require('mongoose')
const User = mongoose.model("User")

//middlewares are functions that get executed before the required function
//this middleware is checking if the user is logged in before accessing a protected resourse, like watchlists
module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "you must be logged in" })
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_KEY, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "you must be logged in" })
        }

        const { _id } = payload
        User.findById(_id).then(userdata => {
            req.user = userdata
            next()
        })
    })
}