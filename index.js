const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./database/database')

const app = express()

const categoriesControllers = require('./categories/categorisController')
const articlesControllers = require('./articles/articlesControllers')
const userControllers = require('./users/userControllers')

const Article = require('./articles/Article')
const Category = require('./categories/Category')



app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use('/', categoriesControllers)
app.use('/', articlesControllers)
app.use('/', userControllers)

connection
    .authenticate()
    .then(()=>{
        console.log('Conectado ao db')
    }).catch((error) =>{
        console.log(error)
    })

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories})

        })
    })
})

app.get('/:slug', (req, res) => {
    var slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('article', {article: article, categories: categories})
    
            })
        }else{
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect(err)
    })
})

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){

            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories})
            })


        }else{
            res.redirect('/')
        }
    
    }).catch(err => {
        res.redirect('/')
    })
})



app.listen(8000, () => {console.log('O servidor esta rodando')})