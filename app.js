
const                         r = require,
express                    = r('express'),
fs                              = r("fs"),

multer                 = require('multer'),
app                           = express(),
aws                  = require('aws-sdk'),
multerS3             = require('multer-s3'),
serverConst             = r('./modules/auth.js'),
Session            = r('express-session'),
bodyParser               = r('body-parser'),
mysql                        = r('mysql'),
js_orm = r('js-hibernate'),

Sequelize = r('sequelize'),

Server = {
    appRoot : serverConst.appRoot,
    endpoint : serverConst.endpoint,
    webRoot: serverConst.webRoot,
    fileRoot: serverConst.fileRoot,
    indexFile: serverConst.indexFile,
    port: serverConst.port
},


random         = r('./modules/random.js'),
mail         = r('./modules/mailSend.js'),
newpass         = r('./modules/sendpass.js'),
models =           r('./modules/models.js'),
MySQLStore = r('express-mysql-session')(Session),
bcrypt = r('bcryptjs');
/*End of const declaration*/


aws.config.update({
            signatureVersion: serverConst.signatureVersion,
            secretAccessKey: serverConst.secretAccessKey,
            accessKeyId: serverConst.accessKeyId,
            region: serverConst.region
        });


var s3 = new aws.S3();  

var fullImg = "";


var upload  = multer({
          storage: multerS3({
            s3: s3,
            bucket: serverConst.bucket,
            acl: serverConst.acl,
            metadata: function (req, file, cb) {
                
              cb(null, {fieldName: file.fieldname});
            },
            key: function (req, file, cb) {
                
                let mimeType = file.mimetype;
        let pointer = ".";
        let originalname = file.originalname;
        let addpointer = mimeType.slice(6,mimeType.length);
        let endOfFile = pointer.concat(addpointer);

        let sameNameWithoutEndOfFile = originalname.slice(0, originalname.length-4);
        


        fullImg = sameNameWithoutEndOfFile + '-' + Date.now() + endOfFile;
        
              cb(null, fullImg);
            }
          })
        });





// var upload = multer({ storage: storage });

const sequelize = new Sequelize(serverConst.database, serverConst.user, serverConst.password, {
  host: 'localhost',
  dialect: 'mysql',
    // define: {
    //     timestamps: false
    // },

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
 

sequelize.authenticate().then(function(err) {
    if (!!err) {
        console.log('Unable to connect to the database:', err)
    } else {
        console.log('Connection has been established successfully.')
    }
});

const User = models.User;
 
User.sync();
const TUser = models.Tuser; 
TUser.sync();

const I = models.image;
// const TUser = models.Tuser; 
I.sync({logging: console.log });


const comment = models.comment;
comment.sync({logging: console.log})
const config = {
	host     : serverConst.host,
	user     : serverConst.user,
	password : serverConst.password,
	database : serverConst.database,
	protocol: serverConst.protocol,
	port: serverConst.portServer
}

const connection = mysql.createConnection({
	host     : serverConst.host,
    user     : serverConst.user,
    password : serverConst.password,
    database : serverConst.database,
    protocol: serverConst.protocol,
    port: serverConst.portServer
});



const session_js = js_orm.session(config);	
var sessionStore = new MySQLStore(config);


const tempuserMap = session_js.tableMap('tempuser')
.columnMap('id', 'id' )
.columnMap('uName','userName')
.columnMap('fName','firstName')
.columnMap('lName','lastName')
.columnMap('pass','password')
.columnMap('email','email');

const imgUploadMap = session_js.tableMap('images')
.columnMap('id', 'id' ,{isAutoIncrement: true})
.columnMap('imageName', 'name')
.columnMap('pathForImage', 'path')
.columnMap('extention', 'type')
.columnMap('WhoUploaded', 'user');

const commentsMap = session_js.tableMap('comment')
.columnMap('id', 'id', {isAutoIncrement: true})
.columnMap('comment', 'text')
.columnMap('toWho', 'image');


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
key: serverConst.key,
secret: serverConst.secret,
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



    app.post('/multer', upload.any(), (req, res) =>{
    // uploaded the files, got the filen name and the route. Insert it into the database. 
    // ?? Who uploaded it ? that is the question to answer. 
    // How is the database working with images. 
    let imageparse = JSON.parse(req.body.data);
    let  imgArray = imageparse.name.split('.');
    

    let image ={
        'imageName': fullImg,
        'pathForImage': serverConst.bucket + fullImg ,
        'extention' : imgArray[1],
        'WhoUploaded': imageparse.user
    };

    fullImg = "";
    imgUploadMap.Insert(image).then((result)=>{
                        console.log("inserted :" + result.affectedRows);
                        res.end("File uploaded.");
                    }).catch((error)=>{
                        console.log("Error" + error);
                        res.json(error);
                    })
    
    });


    app.get('/imgGet' , (req,res)=>{

var query = session_js.query(imgUploadMap).select();
   query.then((result)=> {
      res.json(result);
  }).catch((err)=>{
      res.json("e", err);
  })
        
    })


    app.post('/resetpass', (req,res)=>{
        let changeEmail = req.body.email;
        var query = session_js.query(userMap)
        .where(
        userMap.email.Equal(changeEmail) // =  
        );

        query.then(function(result) {
          
        if(result.length >= 1 ? addaNewPass(changeEmail) : res.json(false) );
        res.json(true)
        });
    })

function addaNewPass(email){
    let newData = {
        email : email,
        updateP : random.randomizer()
    }
     console.log(newData.email);

    let updateSQL =  "UPDATE users SET updateP = " + newData.updateP + " WHERE email ="  + newData.email;

    let query = session_js.executeSql(updateSQL);
    
query.then(function(result) {
    console.log(result); // array with result 
}).catch(function(error) {
    console.log('Error: ' + error);
});
    // newpass.sendPass(changeEmail, 
}

    app.post('/register', (req,res)=>{ 

    	var query = session_js.query(userMap)
    	.where(
        userMap.email.Equal(req.body.email) // =  
        );

    	query.then(function(result) {

    		if(result.length < 1 ){
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

                  mail.sendMail(email, insertPers.id);
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

                /*
                var sql = 'select * from `User`'
var query = session.executeSql(sql);
    
query.then(function(result) {
    console.log(result); // array with result 
}).catch(function(error) {
    console.log('Error: ' + error);
});*/


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

                 req.session.isLoggedIn = result[0].id; 
                 req.session.xUsername = result[0].username;
                 req.session.xAccess = result[0].userType;
                 req.sessionID = result[0].id.toString();

                 res.header('X-Client-id', req.sessionID).header('X-username', req.session.xUsername).header('X-access', req.session.xAccess).header('x-session_id', req.session_id);           
                 var responseData = {'user_id': result[0].id, 'email': result[0].email, 'username': result[0].username};
                 res.json(responseData); 
   }

})

    	}).catch(function(error) {
    		console.log('Error: ' + error);
    	});
    });


    function logout(req, res){
      delete req.sessionID;
      delete req.session.xAccess;
      req.session.destroy(function(err){
        res.json({loggedOut: true});
    });
  }

  app.delete('/login/deletesession', (req, res) =>{
      logout(req, res);

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



  app.get(Server.endpoint, (req, res) => {
   res.header('X-Client-id', req.sessionID).header('X-username', req.session.xUsername).header('X-access', req.session.xAccess).header("Access-Control-Allow-Methods", "GET, POST","PUT").header("Access-Control-Allow-Headers", "X-Requested-With").header("Access-Control-Allow-Origin", "*");   
   res.sendFile(serverConst.appRoot + Server.webRoot + Server.indexFile);
			// res.json({1:appRoot, 2:Server.webRoot, 3:Server.indexFile});
			
		});
 
   // listen on port 3002
   app.listen(Server.port,  function() {
   	console.log("Server listening on port ", Server.port);
   });
