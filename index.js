const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./database/database')

const app = express()

const CategoriesControllers = require('./categories/CategorisController')

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static('public'))

connection
    .authenticate()
    .then(()=>{
        console.log('Conectado ao db')
    }).catch((error) =>{
        console.log(error)
    })

app.get('/', (req, res) => {
    res.render('index')
})

app.use('/', CategoriesControllers)

app.listen(8000, () => {console.log('O servidor esta rodando')})