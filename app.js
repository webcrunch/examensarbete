const express = require('express');
const app = express();
const session		=	require('express-session');
const bodyParser  	= 	require('body-parser');
const mysql      = require('mysql');
const js_orm = require('js-hibernate');
const port = 3002;
const auth = require('./modules/auth.js');
const random = require('./modules/random.js');
const mail = require('./modules/mailSend.js');
const MySQLStore = require('express-mysql-session')(session);
 var bcrypt = require('bcryptjs');


const config = {
	host     : '127.0.0.1',
	user     : 'root',
	password : 'vbcdb2016',
	database : 'examensdb',
	protocol: 'mysql',
	port: 3306
}

const session_js = js_orm.session(config);	
var sessionStore = new MySQLStore(config);

const userMap = session_js.tableMap('users')
.columnMap('id', 'id', {isAutoIncrement: true})
.columnMap('uName','username')
.columnMap('fName','firstName')
.columnMap('lName','lastName')
.columnMap('pass','password')
.columnMap('roll', "userType")
.columnMap('email','email')
.columnMap('updateP','updateP')
.columnMap('date', "time", {isAutoIncrement: true});

const tempuserMap = session_js.tableMap('tempuser')
.columnMap('id', 'id')
.columnMap('uName','username')
.columnMap('fName','firstName')
.columnMap('lName','lastName')
.columnMap('pass','password')
.columnMap('email','email');


	    // use session middleware
	    app.use(session({ genid: function(req) {
	    	if (typeof req.sessionID != 'undefined') return req.sessionID;
	    },
	    key: 'vbccookie',
	    secret: 'SUW15-secret',
	    store: sessionStore,
      saveUninitialized: true,
      resave: true
	  }));


      // parse all urlencoded request body data
    // for example from "standard" HTML forms
    app.use(bodyParser.urlencoded({extended: false}));
    app.disable('x-powered-by');

    	
    app.post('/register', (req,res)=>{ 
    	//amount of times we "salt" the password
			var saltRounds = 10;

   	bcrypt.genSalt(saltRounds, (err, salt) => {
				if(err)console.log(err);
				//we create the hashed password from the salt
				bcrypt.hash(req.body.pass, salt, (err, hash) => {
					if(err)console.log(err);
					let insertPers = {
    		'id': random.randomizer(),
    		'uName': req.body.userName,
    		'fName': req.body.firstName,
    		'lName': req.body.lastName,
    		'pass': hash,
    		'email': req.body.email
    	}

    	tempuserMap.Insert(insertPers).then ((result)=>{
    		res.json('inserted ' + result.affectedRows);
    	}).catch((error)=>{
    		res.json("error: " + error);
    	})


    	mail.sendMail("google.se", insertPers.id);
    	res.json(true);
						console.log(hash, "inner");
					});
			});

    	// 
    });


    app.get('/validate/:token', (req,res)=>{
    	const id = req.params.token;
    		var query = session_js.query(tempuserMap)
    		.where(
        tempuserMap.id.Equal(id));

	query.then((result)=> {
		if(result.length < 1 || result === "undefined"){
			res.json({respond: "this link is not active, click here to get a  new one --- not yet active ---"});
			
		}
		else{

		let newInsert = {
			'uName': result[0].username,
			'fName': result[0].firstName,
			'lName': result[0].lastName,
			'pass': result[0].password,
			'email': result[0].email  ,
			'roll': 'USER'
		}

		userMap.Insert(newInsert).then ((result)=>{
    		res.json('inserted ' + result.affectedRows);
    	}).catch((error)=>{
    		res.json("error: " + error);
    	})

		}
	}).catch((err)=>{
		res.json("e", err);
	})
    })


		app.post('/login', (req,res)=>{
// auth.auth(, (result)=>{
// 	console.log(result);
// })

// 	    auth(req.body, (response, err) => {
// 	    	if(true){
// 	    		res.json(true);
// 	    	}else{
// 	    		res.json(false);
// 	    	}

// 			});

	var query = session_js.query(userMap)
    		.where(
        userMap.uName.Equal(req.body.userName)
        .And()
        .email.Equal(req.body.email)
        );
        query.then(function(result) {
     		if(result.length > 0){
        	
    			// req.sessionID = result.id;
    			// req.session.xAccess = result.email;
    			// req.session.xUsername = result.username;
    			// req.session.save();
    			// res.header('X-Client-id', req.sessionID).header('X-username', req.session.xUsername).header('X-access', req.session.xAccess);
          res.json(response[0].xUsername, "hej"); 
    		}
    		}).catch(function(error) {
    			console.log(error);
    res.json(false);
	});

});


app.get('/check', (req,res)=>{
	var query = session_js.query(userMap).select();
	query.then((result)=> {
		res.json(result);
	}).catch((err)=>{
		res.json("e", err);
	})

})


app.get('/dashboard', (req,res)=>{
	console.log(req.session.username);
	if(req.session.username == 'undefined'){
		res.json("not logged in");
	}
	else{
		res.json(req.session.username);
	}
})

   // listen on port 3002
   app.listen(port,  function() {
   	console.log("Server listening on port ", port);
   });
