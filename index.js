const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./database/database')

const app = express()

const CategoriesControllers = require('./categories/categorisController')
const articlesControllers = require('./articles/articlesControllers')

const Article = require('./articles/Article')
const Category = require('./categories/Category')


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.set('view engine', 'ejs')
app.use(express.static('public'))

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
        ]
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

app.use('/', CategoriesControllers)
app.use('/', articlesControllers)

app.listen(8000, () => {console.log('O servidor esta rodando')})