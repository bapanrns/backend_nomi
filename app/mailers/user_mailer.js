var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bskart.nm@gmail.com',
    pass: 'oxno gasg oupd koky'
  }
});

module.exports = { transporter };