
var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

//scraping
var request = require("request");
var cheerio = require("cheerio");

var Promise = require("bluebird");
mongoose.Promise = Promise;

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

var dbURI = 'mongodb://localhost/webscraping';

mongoose.connect(dbURI);
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

router.get('/', function (req, res) {
  res.redirect('/index');
});

router.get('/index', function (req, res) {
    res.render("index");
  });

router.get("/scrape", function(req, res) {
  // scrape time
  request("https://www.reddit.com/r/webdev/", function(error, response, html) {

    var $ = cheerio.load(html);
    $("p.title").each(function(i, element) {

      //Save an empty result object
      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      if (result.link.slice(0,4) == "http") {
        if (result.title && result.link) {
            
            Article.find({ title: result.title }, function(err, exists) {
                if (exists.length) {
                    console.log('Article already exists');
                }
                else {

            
                    var entry = new Article(result);

                    
                    entry.save(function(err, doc) {
                      
                      if (err) {
                        console.log(err);
                      }
                     
                      else {
                        console.log(doc);
                      }
                    });
                }
            });
        }
      }
    });

  });
 
  res.json({});
});

//scraped from the mongoDB
router.get("/articles", function(req, res) {
  Article.find({}, function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

// Grab an article by it's ObjectId
router.get("/articles/:id", function(req, res) {
  Article.findOne({ "_id": req.params.id })
  .populate("note")
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});


// Create a new note or replace an existing note
router.post("/articles/:id", function(req, res) {
  var newNote = new Note(req.body);


  newNote.save(function(error, doc) {
  
    if (error) {
      console.log(error);
    }
    
    else {
     
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
 
      .exec(function(err, doc) {
      
        if (err) {
          console.log(err);
        }
        else {
        
          res.send(doc);
        }
      });
    }
  });
});

router.delete("/delete/:id", function (req, res) {

  Article.findById(req.params.id, function(err, article) {
      Note.findByIdAndRemove(article.note, function(err,note){
        Article.findOneAndUpdate({ "_id": req.params.id }, { "note": "" })
          .exec(function(err,doc) {
          console.log('\n\ndelete route - article' + article + "\n");
          console.log('\n');
          res.send(article);
          });
      });
  });

});


module.exports = router;