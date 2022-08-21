const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
require("dotenv").config()

//---------------------------------------------------------------

app.set("view engines", "ejs")
app.use(express.static("public"))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

//---------------------------------------------------------------

//---------------------------------------------------------------

mongoose.connect(process.env.MONGO_URI)

const ArticleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", ArticleSchema)

app.route("/articles")
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles)
            } else {
                res.send(err)
            }
        })
    })
    .post((req, res) => {
        const title = req.body.title
        const content = req.body.content
        const newArticle = new Article({
            title: title,
            content: content
        })
        newArticle.save((err, article) => {
            if (!err) {
                res.send(article)
            } else {
                res.send(err)
            }
        })
    })
    .delete((req, res) => {
        Article.deleteMany((err, articles) => {
            if (!err) {
                res.send({ message: "Successfully deleted all articles.", articles })
            } else {
                res.send(err)
            }
        })
    })


app.route("/articles/:articleTitle")
    //%20==space
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (!err) {
                res.send(foundArticle)
            } else {
                res.send(err)
            }
        })
    })
    .put(async (req, res) => {
        const article = await Article.findOneAndUpdate({ title: req.params.articleTitle }, { content: req.body.content }, { new: true })
        res.send(article)
    })

app.route("/articles/:_id")
    .delete(async (req, res) => {
        const article = await Article.findByIdAndDelete(req.params._id)
        res.send({ message: "Succesfully deleted the article.", article })
    })


//---------------------------------------------------------------



app.listen(process.env.PORT, () => { console.log(`Server running on port ${process.env.PORT}`) })