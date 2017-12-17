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
 	signatureVersion: 'v4',		// 
  secretAccessKey: 'bNp38RMvwRrLzva12js+8sMv6paYxOHQJhIuCBhy',		// insert secret Access  Key
  accessKeyId: 'AKIAJQJYTW3OTT2BPNLQ',		// instert secret Key Id
  region: 'eu-west-1',		// Witch region

  bucket: 'mybucketforupload',   // the name of the bucket     
   acl: 'public-read',      
   key: 'vbccookie',   
  secret: 'SUW15-secret',   
  bucketPath : "https://s3.eu-west-2.amazonaws.com/mybucketforupload/",



/*Database information*/
  host     : '127.0.0.1',		// what host 
 	user     : 'root',		// what user?? 
 	password : 'vbcdb2016',		// whitch password
 	database : 'examensdb',		// the name of the database
 	protocol: 'mysql',		  // sort of protocoll (used by sequlize)
 	portServer: 3306	// Witch port to database 
 	


  			  	
  		    };
  

