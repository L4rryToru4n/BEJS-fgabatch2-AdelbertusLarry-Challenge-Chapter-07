// https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn

const { Prisma } = require("@prisma/client");
const USERS = require("../models/users.model");
const { socketServer } = require('../config/websocket'); 

require('dotenv').config();

const nodemailer = require('nodemailer');
const ejs = require('ejs');

const crypto = require('crypto');

const username = process.env.SMTP_USERNAME;
const password = process.env.SMTP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: username,
    pass: password
  }
});

async function authenticate(req, res) {
  let randomNumber = "";
  let number = 0;
  const body = req.body;

  for(let i = 0; i < 4; i++) {
    number = Math.floor(Math.random() * 11);
    randomNumber += number.toString();
  }
  console.log(randomNumber);

  let receiver = process.env.TEMP_MAIL;
  let subject = "Your Login OTP";
  let content = `Here is your login OTP : ${randomNumber}`;

  let user = await USERS.checkCredentials(body);

  if(user) {

    //Update users's OTP data
    body.otp = randomNumber;
    await USERS.updateUserByEmail(body);
    
    await ejs.renderFile(process.cwd() + '/templates/welcome.ejs', { receiver, content }, async (err, data) => {
      if (err) {
        console.log(err);
      }
      else {
        const mailTemplateOptions = {
          from: process.env.MY_EMAIL,
          to: receiver,
          subject: subject,
          html: data
        };
  
        try {
          const info = await transporter.sendMail(mailTemplateOptions);
    
          console.log(info);
    
          res.send({
            status: true,
            msg: 'Please check your email for OTP login.',
            message_id: `${info.messageId}`
          });
        }
        catch (error) {
          console.error(error);
          res.send({
            status: false,
            msg: `Failed to send email. ${error}`
          });
        }
      }
    });
  }
  else {
    const result = {
      "status": false,
      "message": "Authenticating failed. Please enter correct email or password."
    }
    return res.status(401).send(result);
  }
}

async function verifyOTP (req, res) {
  try {  
    const body = req.body;
    let token = await USERS.verifyOTP(body);

    if (token) {
  
      const result = {
        "status": true,
        "message": "Login successful !",
        "token": token
      }
      
      return res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
      }).status(200).send(result);
    }
    else {
      const result = {
        "status": false,
        "message": "Verifying failed. Invalid OTP."
      }

      return res.status(401).send(result);
    }

  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        return res.status(404).json({
          "status": false,
          "message": "No such user has been found."
        });
      }
      return res.status(404).send({
        "status": false,
        "message": "Verifying failed. Please complete your data request."
      });
    }
  }
}

async function forgotPassword(req, res) {
  try {
    const email = req.body.email;
    await USERS.getUserByEmail(email);

    console.log('Get user by email done');

    const uuid = crypto.randomUUID();
    console.log('UUID done');


    let urlLink = "http://localhost:5001/api/v1/auth/reset-password";

    //Update users's password reset token data
    const body = req.body;
    body.reset_token = uuid;
    await USERS.updateUserByEmail(body);

    console.log('Update user by email done');


    let receiver = process.env.TEMP_MAIL;
    let subject = "Reseting Your Password";
    let content = `Here is your reset password link : ${urlLink}.
                    And here is your reset token link: ${uuid}
                    Please send both the reset token and a new password to the link above`;

    await ejs.renderFile(process.cwd() + '/templates/welcome.ejs', { receiver, content }, async (err, data) => {
      console.log('Rendering email...');
      
      if (err) {
        console.log(err);
      }
      else {
        const mailTemplateOptions = {
          from: process.env.MY_EMAIL,
          to: receiver,
          subject: subject,
          html: data
        };
  
        try {
          const info = await transporter.sendMail(mailTemplateOptions);
    
          console.log(info);
    
          res.send({
            status: true,
            msg: 'If your email exists, please check it for a linkg for reseting your password.',
            message_id: `${info.messageId}`
          });
        }
        catch (error) {
          console.error(error);
          res.send({
            status: false,
            msg: `Failed to send email. ${error}`
          });
        }
      }
    });
  }
  catch (err)
  {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        return res.status(404).json({
          "status": false,
          "message": "No such user has been found."
        });
      }
      return res.status(404).send({
        "status": false,
        "message": "Request reset link failed. Please complete your data request."
      });
    }
  }
}

async function resetPassword (req, res) {
  try {
    let token = req.query.token;

    console.log(`Reset Token : ${token}`);

    let user = await USERS.getUserByResetPasswordToken(token);

    let body = req.body;
    body.email = user.email;

    await USERS.updateUserByEmail(body);

    socketServer.emit('password-reset', { name: body.name, email: body.email });

    const result = {
      "status": true,
      "data": "You have successfully reset your password."
    }

    return res.status(200).json(result);
  }
  catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        return res.status(404).json({
          "status": false,
          "message": "No such user has been found."
        });
      }
      return res.status(404).send({
        "status": false,
        "message": "Request reset link failed. Please complete your data request."
      });
    }
  }
}

function whoami(req, res) {
  return res.status(200).json({
    status: true,
    message: "OK",
    data: { user: req.user }
  });
}

async function clearJWT(req, res) {
  res.clearCookie('access_token');
  return res.status(200).json({
    status: true,
    message: "Log out successful."
  });
} 

module.exports = {
  authenticate,
  verifyOTP,
  forgotPassword,
  resetPassword,
  whoami,
  clearJWT
};