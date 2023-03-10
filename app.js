//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});
//TODO

const articleSchema={
    title:String,
    content:String
};
const Article=mongoose.model("Article",articleSchema);


app.route("/articles")
    .get(function(req,res){
        Article.find((err,results)=>{
            if(!err)res.send(results);
            else res.send(err);
        });
    })
    .post(function(req,res){
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err,result){
            if(!err) res.send("successfully added a new article");
            else res.send(err);
        });
    })
    .delete(function(req,res){
        Article.deleteMany({},(err,result)=>{
            if(!err)res.send("successfully deleted all articles");
            else res.send(err);
        });
    });

app.route("/articles/:articleTitle")
    .get(function(req,res){
        Article.findOne({title:req.params.articleTitle},(err,result)=>{
            if(!err) res.send(result);
            else res.send("NO articles matching that title");
        });
    })
    .put(function(req,res){
        Article.findOneAndUpdate(
            {title:req.params.articleTitle},
            {title:req.body.title , content:req.body.content},
            {overwrite:true},
            function(err,results){
                if(!err)res.send("successuflly update article.");
         });
    })
    .patch(function(req,res){
        Article.findOneAndUpdate(
            {title:req.params.articleTitle},
            {$set:req.body},
            function(err,results){
                if(!err)res.send("successfully udapte article");
        });
    })
    .delete(function(req,res){
        Article.deleteOne(
            {title:req.params.articleTitle},
            function(err,results){
                if(!err)res.send("successfully deleted");
            });
    });
app.listen(3000, function() {
  console.log("Server started on port 3000");
});