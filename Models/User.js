const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    watchlist: [{
        mal_id: {
            type: Number
        }
    }],
    completedlist: [{
        mal_id: {
            type: Number
        },
    }]
})

mongoose.model("User", userSchema);