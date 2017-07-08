
const                         r = require,
express                    = r('express'),
fs                              = r("fs"),
path                          = r("path"),
app                           = express(),
Session            = r('express-session'),
bodyParser  	         = r('body-parser'),
mysql                        = r('mysql'),
js_orm = r('js-hibernate'),
appRoot = path.normalize(__dirname + '/'),

Server = {
	endpoint : '*',
	webRoot: 'www',
	fileRoot: appRoot + 'www',
	indexFile: '/index.html',
	port: 3002
},


auth             = r('./modules/auth.js'),
random         = r('./modules/random.js'),
mail         = r('./modules/mailSend.js'),
MySQLStore = r('express-mysql-session')(Session),
bcrypt = r('bcryptjs');



var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/')
    },
    filename: function (req, file, cb) {
    	let mimeType = file.mimetype;
        let pointer = ".";
        let originalname = file.originalname;
        let addpointer = mimeType.slice(6,mimeType.length);
        let endOfFile = pointer.concat(addpointer);

        let sameNameWithoutEndOfFile = originalname.slice(0, originalname.length-4);
        

        cb(null, sameNameWithoutEndOfFile + '-' + Date.now() + endOfFile);
    }
});
var upload = multer({ storage: storage });





app.post('/multer', upload.any(), function (req, res) {
    // uploaded the files, got the filen name and the route. Insert it into the database. 
    // ?? Who uploaded it ? that is the question to answer. 
    // How is the database working with images. 
    // console.log(req.files[0]);
    res.end("File uploaded.");
});




const config = {
	host     : '127.0.0.1',
	user     : 'root',
	password : 'vbcdb2016',
	database : 'examensdb',
	protocol: 'mysql',
	port: 3306
}

const connection = mysql.createConnection({
	host     : '127.0.0.1',
	user     : 'root',
	password : 'vbcdb2016',
	database : 'examensdb',
	protocol: 'mysql',
	port: 3306
});

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
.columnMap('uName','userName')
.columnMap('fName','firstName')
.columnMap('lName','lastName')
.columnMap('pass','password')
.columnMap('email','email');


	    // use session middleware
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/angular')); // redirect angular JS
app.use('/upload', express.static(__dirname + '/node_modules/ng-file-upload/dist')); // redirect angular JS
app.use(express.static('www'));


app.use(Session({ genid: function(req) {
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
    // parse application/json
    app.use(bodyParser.json());

    app.disable('x-powered-by');


    app.post('/register', (req,res)=>{ 

    	var query = session_js.query(userMap)
    	.where(
        userMap.email.Equal(req.body.email) // =  
        );

    	query.then(function(result) {

    		if(result.length < 1){
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

					tempuserMap.Insert(insertPers).then((result)=>{
						console.log("inserted :" + result.affectedRows);
					}).catch((error)=>{
						console.log("Error" + error);
						res.json(error);
					})

    		// mail.sendMail("google.se", insertPers.id);
    		res.json("we have sent you an confirmation mail. If you have got any check your spam mail.");

					});// end of hash function 
			});// end of genSalt function 

				}
				else{

					res.json({status: "Email error"});
				}
			}).catch(function(error) {
				res.json({status : error});
			});

    	// 
    });

    app.get('/validate/:token', (req,res)=>{
    	const id = req.params.token;

    	var query = session_js.query(tempuserMap)
    	.where(
    		tempuserMap.id.Equal(id));

    	query.then((result)=> {
    		console.log(result);

    		if(result.length < 1 || result === "undefined"){

    			res.json({respond: "this link is not active, click here to get a  new one --- not yet active ---"});
    		}
    		else{

    			let newInsert = {
    				'uName': result[0].userName,
    				'fName': result[0].firstName,
    				'lName': result[0].lastName,
    				'pass': result[0].password,
    				'email': result[0].email  ,
    				'roll': 'USER'
    			}

    			connection.query('DELETE FROM ?? WHERE ?? = ?' , ["tempuser", "id" ,id], (err,rows) => { 
    				console.log("err" + err , "rows" + rows);
    			})

    			userMap.Insert(newInsert).then ((result)=>{

    				console.log('inserted ' + result.affectedRows);
    			}).catch((error)=>{
    				res.json("error: " + error);
    			})
    		}
    	}).catch((err)=>{
    		res.json("e", err);
	});// end of query
    })


    app.post('/login', (req,res)=>{

    	var query = session_js.query(userMap)
    	.where(
        userMap.email.Equal(req.body.email) // =  
        );

    	query.then(function(result) {
    		bcrypt.compare(req.body.pass,  result[0].password, (err, res_boolean) => {
    			if(err){
    				console.log("err" ,err);
    				res.sendStatus(400);
    				    			}
    			else{
    					 req.session.isLoggedIn = result[0].user_id; 
                req.session.xUsername = result[0].first_name;
                req.session.xAccess = result[0].user_type;
                req.sessionID = result[0].user_id.toString();
                res.header('X-Client-id', req.sessionID).header('X-username', req.session.xUsername).header('X-access', req.session.xAccess).header('x-session_id', req.session_id);           
                var responseData = {'user_id': result[0].user_id, 'email': result[0].email, 'username': result[0].first_name};
                res.json(responseData); 


    			// 		req.sessionID = result[0].id;
    			// 		console.log(req.sessionID);
    			// req.session.xAccess = result.email;
    			// req.session.xUsername = result.username;
    			// req.session.save();
    			// res.header('X-Client-id', req.sessionID).header('X-username', req.session.xUsername).header('X-access', req.session.xAccess);
       //    res.json(response[0].xUsername, "hej"); 
    			}

  })

    	}).catch(function(error) {
    		console.log('Error: ' + error);
    	});





// 	console.log(result);
// })

// 	    auth(req.body, (response, err) => {
// 	    	if(true){
// 	    		res.json(true);
// 	    	}else{
// 	    		res.json(false);
// 	    	}

// 			});

	// var query = session_js.query(userMap)
 //    		.where(
 //        userMap.uName.Equal(req.body.userName)
 //        .And()
 //        .email.Equal(req.body.email)
 //        );
 //        query.then(function(result) {
 //     		if(result.length > 0){

 //    		
 //    		}
 //    		}).catch(function(error) {
 //    			console.log(error);
 //    res.json(false);
	// });

});

app.post('/multer', upload.single('file'));


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



    app.get(Server.endpoint, (req, res) => {
    	res.header('X-Client-id', req.sessionID).header('X-username', req.session.xUsername).header('X-access', req.session.xAccess).header("Access-Control-Allow-Methods", "GET, POST","PUT").header("Access-Control-Allow-Headers", "X-Requested-With").header("Access-Control-Allow-Origin", "*");   
    	res.sendFile(appRoot + Server.webRoot + Server.indexFile);
			// res.json({1:appRoot, 2:Server.webRoot, 3:Server.indexFile});
			
		});

   // listen on port 3002
   app.listen(Server.port,  function() {
   	console.log("Server listening on port ", Server.port);
   });
