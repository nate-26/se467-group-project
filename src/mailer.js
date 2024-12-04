// Step 1: Install required packages
// npm install express nodemailer body-parser

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' directory

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use another email service
  auth: {
    user: 'your-email@gmail.com', // Your email
    pass: 'your-app-password' // Use an app password for security
  }
});

// Route to handle email sending
app.post('/send-email', (req, res) => {
  // Extract form data
  const { 
    recipientName, 
    recipientEmail, 
    emailSubject, 
    emailBody 
  } = req.body;

  // Email configuration
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: recipientEmail,
    subject: emailSubject,
    html: `
      <h1>Hello ${recipientName},</h1>
      <p>${emailBody}</p>
      <p>Best regards,<br>Your Name</p>
    `
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});