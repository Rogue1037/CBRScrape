var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 8000;

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/cbr", { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
  axios.get("http://www.cbr.com/").then(function(response){
    var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  var results = [];

  // Select each element in the HTML body from which you want information.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
  // but be sure to visit the package's npm page to see how it works
  $("article").each(function(i, element) {

    var title = $(element).children().text().trim();
    var link = $(element).find("a").attr("href");
    var picture = $(element).find("srcset");

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link,
      picture: picture
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
}); 
});

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
