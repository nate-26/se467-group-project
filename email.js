var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'thewrench467@gmail.com',
    pass: 'Wrench467'
  }
});

var mailOptions = {
  from: 'thewrench467@gmail.com',
  to: 'jcarranza03.jc@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
