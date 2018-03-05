// Dependencies

var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");

var db = require("./models");
var PORT = 3000;
var app = express();

// Configure middleware

// Use morgan logger for requests
app.use(logger("dev"));

// Use body-parsing for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Use express static to serve the public folder as a static directory
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in Javascript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
	useMongoClient: true
});

// Routes
app.get("/", function(req, res){
	
})


app.get("/scrape", function(req, res){
	axios.get("http://www.nytimes.com/").then(function(response){
		var $ = cheerio.load(response.data);
		$("article h1").each(function(i, element){
			var result = {};
			result.article = $(this)
				.children("a")
				.text();
			result.url = $(this)
				.children("a")
				.attr("href");
			result.summary = $(this)
				.children("p")
				.text();
			db.Article.create(result)
				.then(function(dbArticle) {
					console.log(dbArticle);
				})
				.catch(function(err){
					return res.json(err);
			});
		});
		res.send("Scraping Complete!");
	});
});

// Route for getting all headlines from the db
app.get("/articles", function(req, res){
	db.Article.find({})
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

// Route for grabbing a specific headline and giving it its note
app.get("/articles/:id", function(req, res){
	db.Article.findOne({ _id: req.params.id })
	.populate("summary")
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

// Route for saving/updating a headline's note
app.post("/articles/:id", function(req, res){
	db.Note.create(req.body)
	.then(function(dbNote){
		return db.Headline.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
	})
	.then(function(dbHeadline){
		res.json(dbHeadline);
	})
	.catch(function(err){
		res.json(err);
	});
});

// Listen on port 3000
app.listen(PORT, function(){
	console.log("App running on port " + PORT + "!");
});