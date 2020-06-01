const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const passport = require('passport')

const {db,Users} = require('../config/db')

router.get('/login', async (req, res) => {
    res.render('login')
})

router.get('/register', async (req, res) => {
    res.render('register')
})

router.post('/register', async(req,res) =>{
    const { name, email, password, password2 } = req.body
    let errors = []

    if(!name || !email || !password || !password2){
        errors.push({ msg: 'please fill in all fields'})
    }

    if(password != password2){
        errors.push({msg: 'passwords do not match'})
    }

    if(password.length < 6){
        errors.push({msg: 'password must be larger than 6 characters'})
    }

    if(errors.length >0){
        res.render('register', { 
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        //validation pass
        const user =  await Users.findByPk(email)

        if(user){
            errors.push({msg: 'user exists'})
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            })  
        }else{
            const hashedpassword = await bcrypt.hash(password, 10)
            const newUser = await Users.create({
                username: name,
                email: email,
                password: hashedpassword
            })
            req.flash('success_msg', 'you are now registered and can log in');
            res.redirect('/users/login')
        }
    }

})

router.post('/login', async(req,res, next) =>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
})

router.get('/logout', (req,res) =>{
    req.logOut();
    req.flash('success_msg','you are logged out')
    res.redirect('/users/login')
})

module.exports = router 