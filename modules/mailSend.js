const mail = require('nodemailer');
// function to create an email and send it 

exports.sendMail = (email, token) =>{
	console.log(token);
	var transporter = mail.createTransport({
   service: "Gmail",  // sets automatically host, port and connection security settings
   auth: {
   	user: 'testningvbc@gmail.com',
   	pass: 'HDs5GDLlKxpvgWkOt5O7'
   },
   tls : {
   	rejectUnauthorized: false
   }
 });


	let mailOptions = {
    from: '"Fred Foo 👻" <foo@blurdybloop.com>', email, // sender address
    to: 'testningvbc@gmail.com',  // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plain text body

    html: '<h2>Thank you for you <b>registration</B> -. <br> You only need to click <a href="http://localhost:3002/validate/' + token + '">here</a> to validate your user</h2>' 
  };

  transporter.sendMail(mailOptions, (error, info) => {
  	if (error) {
  		return console.log(error);
  	}
  	console.log('Message %s sent: %s', info.messageId, info.response);
  });

}
