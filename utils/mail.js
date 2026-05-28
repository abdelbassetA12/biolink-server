const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

  host: "74.125.69.108",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

});

transporter.verify((error, success) => {

  if (error) {

    console.log("MAIL ERROR:");
    console.log(error);

  } else {

    console.log("MAIL SERVER READY");

  }

});

module.exports = transporter;
/*
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
 
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

});

transporter.verify((error, success) => {

  if (error) {

    console.log("MAIL ERROR:");
    console.log(error);

  } else {

    console.log("MAIL SERVER READY");

  }

});


module.exports = transporter;
*/
/*
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = transporter;
*/