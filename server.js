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

// Set up Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view-engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in Javascript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
	useMongoClient: true
});

// Routes

// Get all articles
app.get("/", function(req, res){
	db.Article.find({"saved": false})
	.then(function(dbHome){
		res.json(dbHome);
	})
	.catch(function(error){
		res.json(error);
	});
});

// Get all saved articles
app.get("/saved", function(req, res){
	db.Article.find({"saved": true})
	.populate("comments")
	.then(function(dbSaved) {
		res.json(dbSaved);
	})
	.catch(function(error){
		res.json(error);
	});
})

// Route that lets the user scrape the articles from the New York Times
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

// Route for getting all articles from the db
app.get("/articles", function(req, res){
	db.Article.find({})
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

// Route for grabbing a specific article and giving it its comments
app.get("/articles/:id", function(req, res){
	db.Article.findOne({ _id: req.params.id })
	.populate("comments")
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

// Route for saving an article
app.post("/articles/save/:id", function(req, res){
	db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true });
})
.then(function(dbArticle) {
	res.json(dbArticle);
})
.catch(function(err){
	res.json(err);
});

// Route for deleting a saved article
app.post("/articles/delete/:id", function(req, res){
	db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }, { comments: [] });
})
.then(function(dbArticle) {
	res.json(dbArticle);
})
.catch(function(err){
	res.json(err);
});

// Route for creating a new note
app.post("/comments/save/:id", function(req, res){
	db.Comment.create(req.body)
	.then(function(dbComment){
		return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: dbComment._id } }, { new: true });
	})
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

// Route for deleting a note from the comment
app.post("/comments/delete/:comment_id/:article_id", function(req, res){
	db.Comment.fineOneAndRemove({ _comment_id: req.params.comment_id })
	.then(function(dbComment){
		return.dbArticle.fineOneAndUpdate({ _article_id, req.params.article_id }, { $pull: { comment_id: req.params.comment_id }});
	})
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

// Listen on port 3000
app.listen(PORT, function(){
	console.log("App running on port " + PORT + "!");
});