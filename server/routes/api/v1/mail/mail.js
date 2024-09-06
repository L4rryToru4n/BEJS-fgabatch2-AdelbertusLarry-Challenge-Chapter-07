var express = require('express');
var router = express.Router();
require('dotenv').config();

const nodemailer = require('nodemailer');
const ejs = require('ejs');

const username = process.env.SMTP_USERNAME;
const password = process.env.SMTP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: username,
    pass: password
  }
});

router.post('/send', async function (req, res, next) {

  let receiver = req.body.receiver;
  let subject = req.body.subject;
  let content = req.body.content;

  await ejs.renderFile(process.cwd() + '/templates/welcome.ejs', { receiver, content }, async (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      const mailTemplateOptions = {
        from: 'larrydennis.ltoruan@gmail.com',
        to: receiver,
        subject: subject,
        html: data
      };

      try {
        const info = await transporter.sendMail(mailTemplateOptions);
  
        console.log(info);
  
        res.send({
          status: true,
          msg: 'Success sending email with a template.',
          message_id: `${info.messageId}`
        });
      }
      catch (error) {
        console.error(error);
        res.send({
          status: false,
          msg: `Failed to send email with template. ${error}`
        });
      }
    }
  });
});

module.exports = router;
