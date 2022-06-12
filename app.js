const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _= require("lodash");
const { name } = require("ejs");
const mongoose=require("mongoose");
const app = express();
const posts=[];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//database stuff

mongoose.connect("mongodb+srv://KNNK:KNNK@cluster0.chhmj.mongodb.net/notemakerDB");
const noteSchema=mongoose.Schema({
        title: String,
        content: String,
        title_lodash: String,
        time:{
            hours: Number,
            minutes: Number
        },
        date:{
            day: Number,
            month: Number,
            year: Number
        }
});
const Note=mongoose.model("Note",noteSchema);
//get requests C:\Program Files\MongoDB\Server\5.0\data\
app.get("/", function(req, res)
{
    Note.find(function(err,notes)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("home2",{posts:notes});
        }
    });
});

app.get("/addnote",function(req, res) 
{
    res.render("newnote");
});

app.get("/posts/:postname",function(req, res) {
    Note.find({title_lodash: _.lowerCase(req.params.postname)},function(err,notes)
    {
        if(err){
            console.log(err);
        }
        else{
            console.log(notes);
            res.render("uniquenote",{post:notes});
        }
    });
});

app.get("/posts/modify/:postname",function(req, res) 
{
    Note.find({title_lodash: _.lowerCase(req.params.postname)},function(err,notes)
    {
        if(err){
            console.log(err); 
        }
        else{
            console.log(notes);
            res.render("modify",{post:notes});
        }
    });
});
//
//post requests
const date=new Date();
app.post("/addnote",function(req, res) {
    if(req.body.noteTitle==="")
    {
        res.redirect("/");
    }
    else
    {
        const newPost={
            title:req.body.noteTitle,
            content:req.body.noteContent,
            title_lodash:_.lowerCase(req.body.noteTitle),
            time:{
                hours:date.getHours(),
                minutes:date.getMinutes()
            },
            date:{
                day:date.getDate(),
                month:date.getMonth()+1,
                year:date.getFullYear()
            }
        };
        let note=new Note(newPost);
        note.save(function(err)
        {
            if(err)
            {
                console.log(err);
            }
            else{
                res.redirect("/");
            }
        });
    }
});

app.post("/posts/:postname",function(req, res) 
{  
    Note.deleteOne({title_lodash: _.lowerCase(req.params.postname)},function(err){
        if(err)
        {
            console.log(err);
        }
        else{
            console.log("deletion successfull");
            res.redirect("/");
        }
    });
    
});

app.post("/posts/modify/:postname",function(req, res)
{
    Note.find({title_lodash: _.lowerCase(req.params.postname)},function(err,notes){
        if(err){
            console.log(err);
        }
        else{
            console.log(notes);
        }
    });
    Note.updateOne({title_lodash: _.lowerCase(req.params.postname)},{ content: req.body.modifiedContent },function(err){
        if(err)
        {
            console.log(err);
        }
        else{
            console.log("modified");
            res.redirect("/");
        }
    });
    
});

//listen
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port,function()
{
    console.log("server started on port 8000");
});