import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' directory
app.use(cors({
  origin: 'http://localhost:5173',  // Allow only your frontend's origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Route to handle email sending
app.post('/send-email', (req, res) => {
  const { recipientName, recipientEmail, emailSubject, emailBody } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'nathaniel12027@gmail.com',
    subject: 'Test',
    html: `
      <h1>Hello ${recipientName},</h1>
      <p>Hello vro.</p>
      <p>Best regards,<br>The Wrench</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent successfully');
  });
});

// Database connection setup
const legacyDB = mysql.createConnection({
  host: process.env.LEGACY_DB_HOST,
  user: process.env.LEGACY_DB_USER,
  password: process.env.LEGACY_DB_PASSWORD,
  database: process.env.LEGACY_DB_NAME
});

legacyDB.connect((err) => {
  if (err) {
    console.error('Legacy DB connection failed:', err.message);
  } else {
    console.log('Connected to legacy database');
  }
});

const newDB = mysql.createConnection({
  host: process.env.NEW_DB_HOST,
  user: process.env.NEW_DB_USER,
  password: process.env.NEW_DB_PASSWORD,
  database: process.env.NEW_DB_NAME
});

newDB.connect((err) => {
  if (err) {
    console.error('New DB connection failed:', err.message);
  } else {
    console.log('Connected to new database');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
