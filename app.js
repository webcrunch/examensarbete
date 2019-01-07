

/*förklara från börjar vad allt gör på engenska 
Author: Jarl H Lindquist
Code for Thesis about an cms for uploading pictures. 
See github page for the written thesis. 
*/

// This is the node server file(app.js). From here everything happens. 
// When you start from beginning and have cloned or downloaded from github you need to change the
// name of TempA.js into auth.js. Otherwise app.js will not find the correct information it will need for connection.
// First we declares all variables. And we make them const because they will not change. 
const                         r = require,
express                    = r('express'),
fs                              = r("fs"),
path                        = r("path"), 
multer                 = r('multer'),
app                           = express(),
aws                  = require('aws-sdk'),
multerS3             = require('multer-s3'),
serverConst             = r('./modules/auth.js'),// <--IMPORTANT 

Session            = r('express-session'),
bodyParser               = r('body-parser'),
mysql                        = r('mysql'),
js_orm = r('js-hibernate'),

Sequelize = r('sequelize'),



/* 
Get data from moduls-> auth.js . 
In that file is all sensetive data like password set. 
In Server object we get the root of the whole project. 
EndPoint is 

*/
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
/*hash variable, empthy untill it will be inserted an value and after the value is used it will be mepthy again*/
var SaltPass = "";
console.log(Server);


aws.config.update({
            signatureVersion: serverConst.signatureVersion,
            secretAccessKey: serverConst.secretAccessKey,
            accessKeyId: serverConst.accessKeyId,
            region: serverConst.region
        });

const s3 = new aws.S3();  
// This variable is an temporary container for image upload in multer. The purpose is 
var fullImg = "";

/*

use this if you dont want to implement amazon, 
instead the images will upload onto another place like 
localy on the computer. 

var multer  = require('multer');
 +var storage = multer.diskStorage({
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
 +});
 +var upload = multer({ storage: storage });


*/
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



const sequelize = new Sequelize(serverConst.database, serverConst.user, serverConst.password, {
  host: 'localhost',
  dialect: 'mysql',
    logging: false,


    // define: {
    //     timestamps: false
    // },

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
 
// Check if sequlize could connect with database. 
sequelize.authenticate().then(function(err) {
    if (!!err) {
        console.log('Unable to connect to the database:', err)
    } else {
        console.log('Connection has been established successfully.')
    }
});

// Variable that store the model of Users from moduels -> models.js 
// removed all console.logging on start of all models => (User, TUser, Image, Comments)
const User = models.User;
User.sync({logging: false});

// Variable that store the model of Temporary Users from moduels -> models.js
const TUser = models.Tuser; 
TUser.sync({logging: false});

// Variable that store the model of Images from moduels -> models.js
const I = models.image;
// const TUser = models.Tuser; 
I.sync({logging: false});

// Variable that store the model of Comments from moduels -> models.js
const comment = models.comment;
comment.sync({logging: false})
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


const session_js = js_orm.session(config),	
      sessionStore = new MySQLStore(config);


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


const tempuserMap = session_js.tableMap('tempusers')
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


    // 
    app.post('/multer', upload.any(), (req, res) =>{
    // uploaded the files, got the filen name and the route. Insert it into the database. 
    // ?? Who uploaded it ? that is the question to answer. 
    // How is the database working with images. 
    let imageparse = JSON.parse(req.body.data);
    let  imgArray = imageparse.name.split('.');
    

    let image ={
        'imageName': fullImg,
        'pathForImage': serverConst.bucketPath + fullImg ,
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

    // When an User don´t remember its password and want to reset it with another. 
    app.post('/resetpass', (req,res)=>{
        let size = "";
        let changeEmail = req.body.email;
                   User.find({where:{email : changeEmail }}).then(obj => {
                      if(obj === 'undefined' || obj === null? size = false : size = true);


                    if(size ? addaNewPass(changeEmail,obj ) : res.json(false) );
                      res.json(true);
                    });

    })

          function addaNewPass(email, obj){
          let token = random.randomizer();
          obj.update({
            updateP: token
          }).then(function() {
               newpass.sendPass(email,token);
               return;
            })
          }
  // When an user wants to update its password. 
  app.post('/updatePassword', (req,res) =>{

      // set an variable with data from frontend. 
      let dataChange = req.body.data;
      // call the salt function and set password as an parameter. 
      // The return statement will be inserted into SaltPass variable. 
      salt(dataChange.password);

      /*Check for the information about the user.
        Make an SQL query with sequelize and the result will be obj. 
        SQL query: SQL Select * where updateP = dataChange.token
       */
      
      User.find({ where: {updateP : dataChange.token} }).then(obj => {
              // check if obj got an size. If it got an size set it to true. Otherwise set it to false. 
              if(obj === 'undefined' || obj === null? size = false : size = true);

                    // check if obj is true. then do an update on obj. And send an message back to frontend. 
                    // Otherwise just send an false message back to frontend. 
                    // SQL (Update obj set password : SaltPass , updateP = "")
                    if(size ?    obj.update({
                  password : SaltPass,
                  updateP: ""
                }) : res.json(false) );
                  res.json({message: "your password changed"});
             
                });
        // Make variable of SaltPass empty.
        SaltPass = "";
  });



    function salt(pass){
        var saltRounds = 10;
          bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err)return err ;
        
        bcrypt.hash(pass, salt, (err, hash) => {
          if(err)return err;
          
          
          SaltPass = hash;
      })
       });

    }


    app.post('/register', (req,res)=>{ 
            console.log(req.body);
      let email = req.body.email;
    	var query = session_js.query(userMap)
    	.where(
        userMap.email.Equal(email) // =  
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
						'userName': req.body.userName,
						'firstName': req.body.firstName,
						'lastName': req.body.lastName,
						'password': hash,
						'email': req.body.email
					}

          TUser.create(insertPers);
          TUser.sync();

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
        console.log(id);
    
    	var query = session_js.query(tempuserMap)
    	.where(
    		tempuserMap.id.Equal(id));

    	query.then((result)=> {
    		console.log(result, "res");

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
            console.log(newInsert, "newI");

            TUser.destroy({
            where: {
            id: id
            }
            });

    			// connection.query('DELETE FROM ?? WHERE ?? = ?' , ["tempuser", "id" ,id], (err,rows) => { 
    			// 	console.log("err" + err , "rows" + rows);
    			// })

    			userMap.Insert(newInsert).then ((result)=>{

    				console.log('inserted ' + result.affectedRows);
    			}).catch((error)=>{
    				res.json("error: " + error);
    			})
    		}
    	}).catch((err)=>{

    		console.log("e", err);
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
    const name = req.session.userName;
    console.log(name, "gg");
    res.json(true);
  //  if(req.session.username === 'undefined'){
  //     console.log("hek");
  //     res.json({text: "not logged in"});
  // }
  // else{
  //     res.json({text: req.session.username});
  // }
})



  app.get(Server.endpoint, (req, res) => {
   res.header('X-Client-id', req.sessionID).header('X-username', req.session.xUsername).header('X-access', req.session.xAccess).header("Access-Control-Allow-Methods", "GET, POST","PUT").header("Access-Control-Allow-Headers", "X-Requested-With").header("Access-Control-Allow-Origin", "*");   
   res.sendFile(path.normalize(serverConst.appRoot + Server.webRoot + Server.indexFile));
			// res.json({1:appRoot, 2:Server.webRoot, 3:Server.indexFile});
			
		});

   // listen on port 3002 
   app.listen(Server.port,  function() {
   	console.log("Server listening on port ", Server.port);
   });
