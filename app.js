var express = require('express');
var app = express();
var session		=	require('express-session');
var bodyParser  	= 	require('body-parser');
var mysql      = require('mysql');

var port = 3002;

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'vbcdb2016',
  database : 'examensdb'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();



	    // use session middleware
	    app.use(session({ genid: function(req) {
        if (typeof req.sessionID != 'undefined') return req.sessionID;
      },
	    	secret: 'SUW15-secret',
	    	resave: false,
	    	saveUninitialized: true
	    }));

      // parse all urlencoded request body data
    // for example from "standard" HTML forms
    app.use(bodyParser.urlencoded({extended: false}));


    app.get('/fisk', (req,res)=>{
    	
    });


    app.post('/insert', (req,res) =>{
    	
    	
    	console.log(req.body.email);
    	var obj = {
    		userName : req.body.userName,
    		firstName : req.body.firstName,
    		lastName : req.body.lastName,
    		email : req.body.email,
    		token : req.body.token
    	}

    	console.log(obj);

    	req.session.email = obj.email;
    	req.session.username = obj.userName;
 			
   });


		app.post('/login', (req,res)=>{
	    auth(req.body, (response, err) => {
	    	if(true){
	    		res.json(true);
	    	}else{
	    		res.json(false);
	    	}
	    	
			});
});

 function auth(session, cb){
     

     cb(true);
    }

   // listen on port 3000
   app.listen(port,  function() {
   	console.log("Server listening on port ", port);
   });
