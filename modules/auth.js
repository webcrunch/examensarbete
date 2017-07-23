const        r = require,
path                          = r("path"),
appRoot = path.normalize(__dirname + "/../" +  '/');

module.exports = settings = {

	endpoint : '*',
	webRoot: 'www',
	fileRoot: appRoot + 'www',
	indexFile: '/index.html',
	port: 3002,
	signatureVersion: 'v4',
  secretAccessKey: 'YEk1D/WjhpbkW6e8j4qwTj0PGgvLdcNHJMnlAeLP',
  accessKeyId: 'AKIAIRVIPGVDMYQNGF7A',
  region: 'eu-west-1',
  host     : '127.0.0.1',
	user     : 'root',
	password : 'vbcdb2016',
	database : 'examensdb',
	protocol: 'mysql',
	portServer: 3306,
	bucket: 'mybucketforupload',
  acl: 'public-read',
  key: 'vbccookie',
	secret: 'SUW15-secret',
	

};

/*
seckretAccesKey : YEk1D/WjhpbkW6e8j4qwTj0PGgvLdcNHJMnlAeLP
accessKey : AKIAIRVIPGVDMYQNGF7A

*/

