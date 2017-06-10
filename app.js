const express = require('express');
const app = express();
const session		=	require('express-session');
const bodyParser  	= 	require('body-parser');
const mysql      = require('mysql');
const js_orm = require('js-hibernate');
const port = 3002;




const config = {
	host     : '127.0.0.1',
  user     : 'root',
  password : 'vbcdb2016',
  database : 'examensdb',
  protocol: 'mysql',
  port: 3306
}

const session_js = js_orm.session(config);	

const userMap = session_js.tableMap('users')
.columnMap('id', 'id', {isAutoIncrement: true})
.columnMap('uName','username')
.columnMap('fName','firstName')
.columnMap('lName','lastName')
.columnMap('pass','password')
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
	    	secret: 'SUW15-secret',
	    	resave: false,
	    	saveUninitialized: true
	    }));

      // parse all urlencoded request body data
    // for example from "standard" HTML forms
    app.use(bodyParser.urlencoded({extended: false}));


    app.post('/register', (req,res) =>{
    	

/*    	let insertPers = {
	'uName': req.body.userName,
	'fName': req.body.firstName,
	'lName': req.body.lastName,
	'pass': req.body.pass,
	'email': req.body.email,
	'token': randomizer()
	}*/
	

	let insertPers = {
		'id': randomizer(),
		'uName': req.body.userName,
		'fName': req.body.firstName,
		'lName': req.body.lastName,
		'pass': req.body.pass,
		'email': req.body.email
	}

	tempuserMap.Insert(insertPers).then ((result)=>{
	res.json('inserted ' + result.affectedRows);
}).catch((error)=>{
	res.json("error: " + error);
})
    
   });


// 		app.post('/login', (req,res)=>{
// 	    auth(req.body, (response, err) => {
// 	    	if(true){
// 	    		res.json(true);
// 	    	}else{
// 	    		res.json(false);
// 	    	}
	    	
// 			});
// });


		app.get('/check', (req,res)=>{
			var query = session_js.query(userMap).select();
query.then((result)=> {
	res.json(result);
}).catch((err)=>{
	res.json("e", err);
})

		})





function randomizer (){
		// have two empty arrays for inser data and two string containers for modification of data. 
		var idN = [];
		var idFirst = "";
		var id = "";
		var StringA = [];
		var alphabetL = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
		var alphabetU = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
		// first it create 10 random numbers and insert them into idN
		for(var i = 10; i>0; i--){
			idN.push(Math.floor(Math.random() * 99) + 10);
		}

		
	 	// After that it loop 10 times.
		for(var i = 0; i< 10; i++){
			StringA.push(alphabetL[Math.floor(Math.random() * 25) + 0]);// it randomise a number and from the number it ges an letter from the lover case alphabets arrayn. And then we insert them into StringA arrayn.
			StringA.push(idN[Math.floor(Math.random() * 9) +0]); // it takes an random number from the numbers it created and insert it to StringA arrayn.
			StringA.push(alphabetU[Math.floor(Math.random() * 25) + 0]); // it randomise a number and from the number it ges an letter from the Upper case alphabets arrayn. And then we insert them into StringA arrayn.
		}

	 	// every value in the array converts to string element
	 	idFirst = StringA.toString();

	 
	 	// loop all the element in idFirst arrayn and inserts everything but "," in id and then return id.
		for(var i = 0; i < idFirst.length; i++){
			if(idFirst.charAt([i]) !== ","){
				if(id.length < 1){
					id = idFirst.charAt([i]);
				}
				else{
					id = id.concat(idFirst.charAt([i]));
				}
			}		
	}


	return id;
}

 function auth(session, cb){
     

     cb(true);
    }

   // listen on port 3002
   app.listen(port,  function() {
   	console.log("Server listening on port ", port);
   });
