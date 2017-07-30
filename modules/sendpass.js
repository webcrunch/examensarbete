const mail = require('nodemailer');
// function to create an email and send it 

exports.sendPass = (email, token) =>{
  console.log(token);
	console.log(email);
	// var transporter = mail.createTransport({
 //   service: "Gmail",  // sets automatically host, port and connection security settings
 //   auth: {
 //   	user: 'testningvbc@gmail.com',
 //   	pass: 'HDs5GDLlKxpvgWkOt5O7'
 //   },
 //   tls : {
 //   	rejectUnauthorized: false
 //   }
 // });


	// let mailOptions = {
 //    from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
 //    to: 'testningvbc@gmail.com',  // list of receivers
 //    subject: 'New pass ✔', // Subject line
 //    text: 'Hello world ?', // plain text body

 //    html: '<h2></h2>' 
 //  };

 //  transporter.sendMail(mailOptions, (error, info) => {
 //  	if (error) {
 //  		return console.log(error);
 //  	}
 //  	console.log('Message %s sent: %s', info.messageId, info.response);
 //  });

 return;

}
