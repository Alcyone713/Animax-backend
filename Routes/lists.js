const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const requireLogin = require('../requireLoginMiddleware.js')
const { PythonShell } = require('python-shell')
require('dotenv').config()


//route to add animes to completed list
router.put('/add_to_completedlist', requireLogin, async (req, res) => {
    await User.findOneAndUpdate({ email: req.user.email }, {
        $push: {
            completedlist:
            {
                mal_id: req.body.mal_id
            }
        },
    })
        .then(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                res.json({ message: "successfully send" })
                console.log(success);
            }
        })
})

//route to get all the user details, specifc details can later be parsed in the frontend
router.get('/userdetails', requireLogin, async (req, res) => {
    await User.find({ email: req.user.email })
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            console.log(err)
        })
})

//route to add animes to watchlist
router.put('/add_to_watchlist', requireLogin, async (req, res) => {
    await User.findOneAndUpdate({ email: req.user.email }, {
        $push: {
            watchlist:
            {
                mal_id: req.body.mal_id
            }
        },
    })
        .then(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                res.json({ message: "successfully send" })
                console.log(success);
            }
        })
})

//Route to get recommendations, this routes runs the python script from the python-shell. 
router.get('/recommendations', requireLogin, async (req, res) => {
    const CompletedList = await User.find({ email: req.user.email })
    let completedArray = [];
    let i = 0;
    CompletedList[0].completedlist.forEach(e => {
        let mal = e.mal_id;
        completedArray[i] = mal;
        i++;
    });
    /*the input that goes to the python script will only consider the last 10 elements of the completed list, this is done to
    increase the speed of the algorithm */
    if (completedArray.length > 10) {
        completedArray = completedArray.slice(completedArray.length - 10, completedArray.length - 1)
    }
    completedArray = JSON.stringify(completedArray)

    let options = {
        mode: 'json',
        pythonPath: process.env.PYTHON_PATH,
        scriptPath: './Python',
        args: completedArray
    }

    PythonShell.run('Content_based_recommender.py', options, function (err, results) {
        if (err) {
            console.log(err)
        }
        /*python-shell returns an array with all the outputs, since there's only one print statement in the python script
        we are only returning the first element*/
        res.send(results[0])
    })
})


module.exports = router




