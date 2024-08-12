const nodemailer = require("nodemailer");

const sendEmail = options => {
  //1) create a transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    //Active in gmail "less secure app" option
  });

  //2) define the mail options
  //3) actually send the email
};
