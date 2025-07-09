const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load .env if using

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve contact form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Handle form submission
app.post('/send', async (req, res) => {
  const { name, company, email, phone, message } = req.body;

  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${name}</li>
      <li>Company: ${company}</li>
      <li>Email: ${email}</li>
      <li>Phone: ${phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${message}</p>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'New Contact Request',
      html: output
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    res.send('<h2>Email sent successfully. <a href="/">Go back</a></h2>');
  } catch (err) {
    console.error(err);
    console.log('Error sending email:', err);
    res.send('<h2>Error sending email. <a href="/">Try again</a></h2>');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
