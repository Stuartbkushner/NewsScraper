// Dependencies

var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// Enables scraping
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;
var app = express();

// Configure middleware

// Use morgan logger for requests
app.use(logger("dev"));

// Use body-parsing for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));

// Use express static to serve the public folder as a static directory
app.use(express.static("public"));

// Set up Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view-engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in Javascript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  //useMongoClient: true
});

// Routes

// Route for scraping all of the articles
app.get("/scrape", function(req, res){
	axios.get("https://www.nytimes.com/").then(function(response){
		var $ = cheerio.load(response);
		$("article.story").each(function(i, element){
			var result = {};
			result.title = $(this).children("h2.story-heading").children("a").text();
			result.summary = $(this).children("p.summary").text();
			result.link = $(this).children("h2.story-heading").children("a").attr("href");
			db.Article.create(result)
			.then(function(dbArticle) {
				console.log(dbArticle);
				res.send("Scraping Complete!");
			})
			.catch(function(err){
				return res.json(err);
			});
		});
		res.redirect("/");
	});
});

// Route for grabbing every article from the DB
app.get("/", function(req, res){
	db.Article.find({}).populate("comments").then(function(data){
		res.render("home", { articles: data });
	}).catch(function(err){
		res.json(err);
	});
});

// Route for grabbing a specific article with it's ID, populate it with it's comments
app.get("/articles/:id", function(req, res){
	db.Article.findOne({ _id: req.params.id }).populate("comments").then(function(data){
		res.json(data);
	}).catch(function(err){
		res.json(err);
	});
});

// Route for saving/updating an article's associated comment
app.post("/articles/:id", function(req, res){
	db.Comment.create(req.body)
	.then(function(dbComment){
		return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: { comments: dbComment }})
		.then(function(dbRes){
			res.redirect("/");
		});
	})
});

// Route for deleting a saved article
app.post("/articles/delete/:id", function(req, res){
	db.Comment.remove({ _id: req.params.id }).then(function(dbRemove){
		res.json(dbRemove);
	})
});

// Route for saving an article
app.post("/articles/save/:id", function(req, res){
	db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
	.then(function(dbReturn){
		res.redirect("/");
	})
});

// Route for removing an article from saved
app.post("/articles/remove/:id", function(req, res){
	db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
	.then(function(dbReturn){
		res.redirect("/");
	})
});

// Display all saved articles
app.get("/saved", function(req, res){
	db.Article.find({ saved: true }).populate("comments").then(function(data){
		res.render("saved", { articles: data });
	}).catch(function(err){
		res.json(err);
	});
});


// Listen on port 3000
app.listen(PORT, function(){
	console.log("App running on port " + PORT + "!");
});