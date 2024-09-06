const { Prisma } = require("@prisma/client");
const USERS = require("../models/users.model");

async function getUsers(req, res) {
  try {
    let user = await USERS.getUsers();

    const data = JSON.stringify(user, (key, value) =>
      typeof value === "bigint" ? value.toString() + "n" : value
    );

    const temp = JSON.parse(data);

    const result = {
      "status": true,
      "data": temp
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({
      "status": false,
      "message": "Failed to get users."
    });
  }
}

async function getUser(req, res) {
  try {
    const user_id = req.params.id;
    let user = await USERS.getUser(user_id);

    const data = JSON.stringify(user, (key, value) =>
      typeof value === "bigint" ? value.toString() + "n" : value
    );

    const temp = JSON.parse(data);

    const result = {
      "status": true,
      "data": temp
    }

    return res.status(200).json(result);

  } catch (err) {
    return res.status(404).json({
      "status": false,
      "message": "No user has been found."
    });
  }
}

async function createUser(req, res) {
  try {
    const body = req.body;
    let user = await USERS.createUser(body);

    const data = JSON.stringify(user, (key, value) =>
      typeof value === "bigint" ? value.toString() + "n" : value
    );

    const temp = JSON.parse(data);

    const result = {
      "status": true,
      "data": temp
    }

    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({
      "status": false,
      "message": "Create user failed. Please complete your data request."
    });
  }
}

async function updateUser(req, res) {
  try {
    const body = req.body;
    const user_id = req.params.id

    let user = await USERS.updateUser(user_id, body);

    const data = JSON.stringify(user, (key, value) =>
      typeof value === "bigint" ? value.toString() + "n" : value
    );

    const temp = JSON.parse(data);

    const result = {
      "status": true,
      "data": temp
    }

    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        return res.status(404).json({
          "status": false,
          "message": "No such user has been found."
        });
      }
      return res.status(400).json({
        "status": false,
        "message": "Update user failed. Please complete your data request."
      });
    }
  }
}

async function deleteUser(req, res) {
  try {
    const user_id = req.params.id
    let user = await USERS.deleteUser(user_id);

    const data = JSON.stringify(user, (key, value) =>
      typeof value === "bigint" ? value.toString() + "n" : value
    );

    const temp = JSON.parse(data);

    const result = {
      "status": true,
      "data": temp
    }

    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        return res.status(404).json({
          "status": false,
          "message": "No such user has been found."
        });
      }
      return res.status(400).json({
        "status": false,
        "message": "Delete user failed. Please complete your data request."
      });
    }
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};