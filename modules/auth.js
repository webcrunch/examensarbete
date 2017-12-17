var path = require("path");
var appRoot = path.normalize(__dirname + "/../" +  '/');

   module.exports = settings = {
  		  /*server information */
 	endpoint : '*',		
 	webRoot: 'www',		
 	appRoot : appRoot,
 	fileRoot: appRoot + 'www',		
 	indexFile: '/index.html',		
 	port: 3002,		// insert the port the server listens to 
  /*Amazon information*/
 	signatureVersion: '',		// 
  secretAccessKey: '',		// insert secret Access  Key
  accessKeyId: '',		// instert secret Key Id
  region: '',		// Witch region

  bucket: '',   // the name of the bucket     
   acl: '',      
   key: '',   
  secret: '',   
  bucketPath : "",



/*Database information*/
  host     : '',		// what host 
 	user     : '',		// what user?? 
 	password : '',		// whitch password
 	database : '',		// the name of the database
 	protocol: '',		  // sort of protocoll (used by sequlize)
 	portServer: 	// Witch port to database 
 	


  			  	
  		    };
  

