//jshint esversion:6
require("dotenv").config()
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
//const encrypt=require("mongoose-encryption");
const app=express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));

//Database setup

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articleSchema = new mongoose.Schema({
    title:String,
    content:String
});

//const secret=process.env.SECRET;
//articleSchema.plugin(encrypt,{secret:secret,encryptedFields:["content"]});

const Article=mongoose.model("Article",articleSchema);

//Database setup ends.

app.route("/articles")
.get(function(req,res){
    Article.find(function(err,found){
        if(!err)
        {
         res.send(found);
        }
        else
         res.send(err);
    });
})
.post(function(req,res){
    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save();
    res.sendStatus(201);
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        (!err)?res.sendStatus(200):res.status(405).send(err)
    });
});

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,found){
        (!err)?res.send(found):res.send(err);
    });
})
.put(function(req,res){
    Article.findOneAndUpdate(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},
        function(err){
            (!err)?res.sendStatus(200):res.send(err);
        });
})
// .patch(function(req,res){
//     Article.findOneAndUpdate(
//         {title:req.params.articleTitle},
//         {$set:req.body},
//         function(err){
//             (!err)?res.sendStatus(200):res.send(err);
//         });
// })
.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err){
            (!err)?res.sendStatus(200):res.send(err);
        });
});

app.listen(3000,function(){
    console.log("Server started on port 3000 !");
});
