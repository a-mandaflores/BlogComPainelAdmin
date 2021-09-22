const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const User = require('./User')
const bcrypt = require('bcryptjs');


router.get('/admin/users', (req, res) => {
    res.send('Users')
})


router.get('/admin/users/list', (req, res) => {
    User.findAll().then(user => {
        res.render('admin/users/list', {user: user})

    })
})

router.post('/users/create', (req, res) => {
    var email = req.body.email;
    var password = req.body.password


    User.findOne({where:{email: email}}).then(user =>{
        if(user == undefined){

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt)

            User.create({
                email: email,
                password: hash
            }).then(() => {
            res.redirect('/')
            }).catch((err) => {
            res.redirect('/')
            })

        }else{
            res.redirect('/admin/users/create')
        }
    })
})

router.get('/login', (req, res) => {
    res.render('admin/users/login');
})

router.post('/authenticate', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where: {email: email}}).then(user => {
        if(user != undefined){
            var correct = bcrypt.compareSync(password, user.password)

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }

                res.redirect('/admin/articles')
            }else{
                res.redirect('/login')
            }

        }else{
            res.redirect('/login')
        }
    })
})

router.get('logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})


module.exports = router