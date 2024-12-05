import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'thewrench467@gmail.com',
    pass: 'giop uoux givq jkbh' // Use an app password, not your regular password
  }
});

// Route to handle email sending
app.post('/send-email', (req, res) => {
  const { 
    recipientName, 
    recipientEmail, 
    emailSubject, 
    emailBody 
  } = req.body;

  // Email configuration
  const mailOptions = {
    from: 'thewrench467@gmail.com',
    to: recipientEmail || 'thewrench467@gmail.com', // Fallback to your email if not provided
    subject: emailSubject,
    html: `
      <h1>Hello ${recipientName},</h1>
      <p>${emailBody}</p>
      <p>Thank you for shopping with,<br>The Wrench</p>
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