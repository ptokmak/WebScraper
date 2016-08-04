
// ROUTES

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(express.static('public'));

//mongojs 
var mongojs = require('mongojs');
// var databaseUrl = "scraper"; //for local
var databaseUrl = "mongodb://heroku_m0x3bd23:4oe52tkq14f11u5tlobjk3gkj7@ds139645.mlab.com:39645/heroku_m0x3bd23";//for heroku
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database error:', err);
});



module.exports = function(app){

		var i=0;
		app.get('/', function(req, res){
				db.scrapedData.find({}, function(err, found) {
				    
				    // show errors
				    if (err) {
				    	console.log(err);
				    } 				    
				    else {
				    	var artLen = found.length;
					    res.render('index', {
							artTitle: found[i].title,							
							userComment: found[i].comment,
							id: found[i]._id,
							articleNum: i+1,
							totalArticles: artLen,
							urlLink:  found[i].url
						}); 
				    }
				}); 		
		}); 

		//directing 
		app.get('/index', function(req, res){
				res.redirect('/');
		}); 

		//add comment
		app.post('/addComment/:id', function(req, res){
				console.log('object id: ' + mongojs.ObjectId(req.params.id));
				console.log('req: ' + req.body.comment);
				var commentInput = req.body.comment.trim();
				if (commentInput) {
						db.scrapedData.update({
							'_id': mongojs.ObjectId(req.params.id)
						}, {
							$set: {
		      					comment: req.body.comment.trim()
		    				}
		  				}, 

						function (err, edited) {
							if (err) throw error;
							res.redirect('/');
						});	 // end db.scrapedData.update 		
				} // end if
				
				else {
						console.log(commentInput)
						res.redirect('/');	
				} 
		}); 

		//delete comment
		app.post('/delComment/:id', function(req, res){
				db.scrapedData.update({
					'_id': mongojs.ObjectId(req.params.id)
				}, {
					$unset: {
      					comment: ""
    				}
  				}, 

				function (err, deleted) {
					if (err) throw error;
					res.redirect('/');
				});	
		}); 

		//previous news article
		app.get('/prevArticle', function(req, res){
				
				db.scrapedData.find({}, function(err, found) {
				    
				    // show any errors
				    if (err) {
				    	console.log(err);
				    } 				    
				    else {
						var artLen = found.length;
				    	if (i > 0){
							i--;
							res.redirect('/');
							}
				       
				    }
				});

		}); 

		//next news article
		app.get('/nextArticle', function(req, res){
				
				db.scrapedData.find({}, function(err, found) {
				    
				    // show any errors
				    if (err) {
				    	console.log(err);
				    }				    
				    else {

				    	var artLen = found.length;
					    if (i < artLen-1){
							i++;
							res.redirect('/');
						}

				    }
				}); 	

		}); 


}; 