
// Dependencies:
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var request = require('request'); 
var cheerio = require('cheerio'); 
var expHnbrs = require('express-handlebars');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
require('./routes/routes.js')(app);
var PORT = process.env.PORT || 8080;

// mongojs configuration
var mongojs = require('mongojs');
var databaseUrl = "scraper";
var collections = ["scrapedData"];


app.listen(PORT, function(){
  console.log('App running on port: ', PORT)
});