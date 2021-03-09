const nodemailer = require("nodemailer");

function sendEmail(from, to, subject, text) {
  const password = process.env.YAHOO_APP_PW;
  // The following transporter is in place for testing/demo purposes. In production, the transporter would reflect a school's email system.
  const transporter = nodemailer.createTransport({
    service: "Yahoo",
    auth: {
      user: "studenttestaddress",
      pass: password,
    },
  });
  const mailOptions = {
    from,
    to,
    subject,
    text,
  };
  return transporter.sendMail(mailOptions);
}

exports.sendEmail = sendEmail;
