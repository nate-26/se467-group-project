// Step 1: Install required packages
// npm install express nodemailer body-parser
import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' directory

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use another email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS // Use an app password for security
  }
});

app.post('/send-email', (req, res) => {
  const { recipientName, recipientEmail, emailSubject, emailBody } = req.body;

  console.log('Received email data:', { recipientName, recipientEmail, emailSubject, emailBody });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,  // Ensure this is populated correctly
    subject: emailSubject,
    html: `
      <h1>Hello ${recipientName},</h1>
      <p>${emailBody}</p>
      <p>Best regards,<br>Your Name</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      return res.status(500).send(`Error sending email: ${error.message}`);
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});