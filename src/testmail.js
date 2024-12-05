import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.resolve('public'))); // Ensure 'public' folder is served

// Route to handle email sending
app.post('/send-email', (req, res) => {
  const { recipientName, recipientEmail, emailSubject, emailBody } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thewrench467@gmail.com',
      pass: 'giop uoux givq jkbh', // App password
    },
  });

  const mailOptions = {
    from: 'thewrench467@gmail.com',
    to: recipientEmail,
    subject: emailSubject,
    html: `
      <h1>Hello ${recipientName},</h1>
      <p>${emailBody}</p>
      <p>Have an amazing day,<br>The Wrench</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent successfully');
  });
});

// Route to serve the HTML file at '/'
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public', 'emailtest.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
