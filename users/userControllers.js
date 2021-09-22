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



module.exports = router