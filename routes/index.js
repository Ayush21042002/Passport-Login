const express = require('express')

const router = express.Router()

const { ensureAuthenticated} = require('../config/off')

router.get('/', async(req,res) =>{
    res.render('welcome')
})

router.get('/dashboard', ensureAuthenticated ,(req,res) =>{
    res.render('dashboard', {
        name: req.user.username
    })
})

module.exports = router 