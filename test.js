const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zhangjichen96@gmail.com',
    pass: 'zhangjichen1937!'
  }
});

const mailOptions = {
  from: 'zhangjichen96@gmail.com',
  to: 'hans.zhang@sap.com',
  subject: 'Test Email',
  text: 'This is a test email from Nodemailer'
};
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
app.get('/send-email', (req, res) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send('Email failed to send');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully');
    }
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
