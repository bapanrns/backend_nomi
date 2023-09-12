var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bapan.rns@gmail.com',
    pass: 'ggxgtailsreratbl'
  }
});

module.exports = { transporter };