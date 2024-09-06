const { Prisma } = require("@prisma/client");
const USERS = require("../models/users.model");
const { socketServer } = require('../config/websocket');

async function register(req, res) {
  try {
    const body = req.body;
    let user = await USERS.createUser(body);

    const data = JSON.stringify(user, (key, value) =>
      typeof value === "bigint" ? value.toString() + "n" : value
    );

    const temp = JSON.parse(data);

    const result = {
      "status": true,
      "message": "User successsfully registered.",
      "data": temp
    }

    socketServer.emit('get-clients', { name: body.name, email: body.email });

    socketServer.on('connect', () => {
      console.log('Client connected ');
    });

    return res.status(201).json(result);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return res.status(400).json({
          "status": false,
          "message": "User already exists. Please use another email."
        });
      }

      return res.status(400).json({
        "status": false,
        "message": "Registration failed. Please complete your data request."
      });
    }
  }
}

module.exports = { register };