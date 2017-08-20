var path = require("path");
var appRoot = path.normalize(__dirname + "/../" +  '/');

   module.exports = settings = {
  		  
 	endpoint : '*',		
 	webRoot: 'www',		
 	appRoot : appRoot,
 	fileRoot: appRoot + 'www',		
 	indexFile: '/index.html',		
 	port: 3002,		
 	signatureVersion: 'v4',		
  secretAccessKey: '',		
  accessKeyId: '',		
  region: '',		
  host     : '',		
 	user     : '',		
 	password : '',		
 	database : '',		
 	protocol: '',		
 	portServer: '',		
 	bucket: '',		
   acl: '',		
   key: '',		
 	secret: '',		
 	bucketPath : ""
  			  	
  		    };
  