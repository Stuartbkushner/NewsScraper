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

// Since mongoose uses async queries by default, we will set it up to use promises and syntax instead
// Connect to the Mongodb
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/NewsScraper", {
	useMongoClient: true
});

// Routes
app.get("/scrape", function(req, res){
	axios.get("http://www.nytimes.com/").then(function(response){
		var $ = cheerio.load(response.data);
		$("article h1").each(function(i, element){
			var result = {};
			result.headline = $(this)
				.children("a")
				.text();
			result.url = $(this)
				.children("a")
				.attr("href");
			db.Headline.create(result)
				.then(function(dbHeadline) {
					console.log(dbHeadline);
				})
				.catch(function(err){
					return res.json(err);
			});
		});
		res.send("Scraping Complete!");
	});
});

// Route for getting all headlines from the db
app.get("/headlines", function(req, res){
	db.Headline.find({})
	.then(function(dbHeadline){
		res.json(dbHeadline);
	})
	.catch(function(err){
		res.json(err);
	});
});

// Route for grabbing a specific headline and giving it its note
app.get("/headlines/:id", function(req, res){
	db.Headline.findOne({ _id: req.params.id })
	.populate("note")
	.then(function(dbHeadline){
		res.json(dbHeadline);
	})
	.catch(function(err){
		res.json(err);
	});
});

// Route for saving/updating a headline's note
app.post("/headlines/:id", function(req, res){
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