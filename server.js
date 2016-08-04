
// Dependencies
var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var cheerio = require('cheerio'); 
var request = require('request'); 


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
require('./routes/routes.js')(app);
var PORT = process.env.PORT || 8080;

// mongojs configuration
var mongojs = require('mongojs');
// var databaseUrl = "scraper"; //for local
var databaseUrl = "mongodb://heroku_m0x3bd23:4oe52tkq14f11u5tlobjk3gkj7@ds139645.mlab.com:39645/heroku_m0x3bd23";//for heroku
var collections = ["scrapedData"];

// hook our mongojs config to the db var
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});

//setting up handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// request call here
request('http://www.forbes.com/', function (error, response, html) {

            var $ = cheerio.load(html);

            $('h4.editable-hed').each(function(i, element){
                var title = $(this).text().trim();                
                var link = $(this).find('a').attr('href');
                
                if (title && link) {
                  var ttl = {
                    title: title,                    
                    url: link,                    
                  }; 

                console.log(ttl);
                } 
                db.scrapedData.find({url: link} , function (err, found){
                        var foundTitles = found.length;
                        console.log('foundTitles: ' + foundTitles);
                        if (err) {
                          console.log(err);
                        }
                        else {  
                          if (foundTitles == 0) {
                              db.scrapedData.insert(ttl, function (err, saved) {
                                      if (err) {
                                        console.log(err);
                                      }
                                      else {
                                        console.log(saved);
                                        
                                      }   
                              }); 

                          } 
                        }
                });

            }); 

}); 


// listen on port (8080)
app.listen(PORT, function(){
  console.log('App running on port: ', PORT)
});