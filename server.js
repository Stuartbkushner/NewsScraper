// Dependencies

var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var app = express();

// Set the app up with body-parser and a static folder
app.use(
	bodyParser.urlencoded({
		extended: false
	});
);
app.use(express.static("public"));

// Configure the database
var databaseUrl = "newscraper";
var collections = ["articles"];

// Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);

// Log any mongojs errors to console
db.on("error", function(error){
	console.log("Database Error: ", error);
});

// handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
// ======

// Simple index route
app.get("/", function(req, res){
	res.send(index.html);
});

// Handle form submission and save it to mongo
app.post("/save", function(req, res){
	console.log(req.body);

	db.articles.insert(req.body, function(error, saved){
		// Log any errors
		if (error) {
			console.log(error);
		} else {
			// Otherwise, send note back to browser
			// This will fire off the success function of the ajax request
			res.send(saved);
		}
	});
});

// Listen on port 3000
app.listen(3000, function(){
	console.log("App running on port 3000!");
});