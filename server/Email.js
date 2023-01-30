const nodemailer = require("nodemailer");
require("dotenv").config();

async function emailSender(targetEmail, events) {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: targetEmail,
      subject: "Events Suggested For You!",
      text: "That was easy!",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error is " + error);
        resolve(false); // or use rejcet(false) but then you will have to handle errors
      } else {
        console.log("Email sent: " + info.response);
        resolve(true);
      }
    });
  });
}

module.exports = { emailSender };
