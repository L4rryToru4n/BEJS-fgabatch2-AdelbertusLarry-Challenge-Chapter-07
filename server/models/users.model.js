// Create Model for Users

const { PrismaClient, Prisma } = require('@prisma/client');
const client = new PrismaClient();
const jwt = require('jsonwebtoken');
let { JWT_SECRET_KEY } = process.env;
const BCRYPT = require("bcrypt");
const SALTROUNDS = 12

const USERS = {
  getUsers: async () => {
    try {
      let result = await client.users.findMany({
        where: {
          isDeleted: false
        },
        orderBy: {
          id: 'asc'
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: false
        }
      });
      
      return result;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },
  getUser: async (id) => {
    try {

      let result = await client.users.findUniqueOrThrow({
        where: {
          id: Number(id),
          isDeleted: false
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: false
        }
      });
      return result;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientValidationError) {
          console.error(err.message);
      }
      throw err;
    }
  },
  getUserByEmail: async (email) => {
    try {

      let result = await client.users.findUniqueOrThrow({
        where: {
          email: String(email),
          isDeleted: false
        },
        select: {
          name: true,
          email: true
        }
      });
      return result;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientValidationError) {
          console.error(err.message);
      }
      throw err;
    }
  },
  getUserByResetPasswordToken: async (token) => {
    try {

      let result = await client.users.findUniqueOrThrow({
        where: {
          pass_reset_token: String(token),
          isDeleted: false
        },
        select: {
          name: true,
          email: true
        }
      });
      return result;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientValidationError) {
          console.error(err.message);
      }
      throw err;
    }
  },
  checkCredentials: async (body) => {
    try {

      let result = await client.users.findUniqueOrThrow({
        where: {
          email: body.email,
          isDeleted: false
        },
        select: {
          name: true,
          password: true
        }
      });

      let isCredentialsMatch = BCRYPT.compareSync(body.password, result.password);

      return isCredentialsMatch;

    } catch (err) {
      if (err instanceof Prisma.PrismaClientValidationError) {
        console.error(err.message);
      }
      throw err;
    }
  },
  verifyOTP: async (body) => {
    try {
      let result = await client.users.findUniqueOrThrow({
        where: {
          email: body.email,
          otp: body.otp,
          isDeleted: false
        }
      });

      let token = false;

      if(result) {
        let date = new Date(Date.now());

        token = jwt.sign({ "name": result.name, "time": date.toString() }, JWT_SECRET_KEY, {
          expiresIn: '24h'
        });
      }
      
      return token;

    } catch (err) {
      if (err instanceof Prisma.PrismaClientValidationError) {
        console.error(err.message);
      }
      throw err;
    }
  },
  createUser: async (body) => {
    try {
      let salt_pass = BCRYPT.genSaltSync(SALTROUNDS);
      let hashed_pass = BCRYPT.hashSync(body.password, salt_pass);
      let result = await client.users.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashed_pass,
        }
      });
      return result;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },
  updateUser: async (id, body) => {
    try {
      let hashed_pass = body.password;
      if (body.password) {
        let salt_pass = BCRYPT.genSaltSync(SALTROUNDS);
        hashed_pass = BCRYPT.hashSync(body.password, salt_pass);
      }

      let result = await client.users.update({
        where: {
          id: Number(id)
        },
        data: {
          name: body.name,
          email: body.email,
          password: hashed_pass,
        }
      });
      return result;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },
  updateUserByEmail: async (body) => {
    try {
      let hashed_pass = body.password;
      if (body.password) {
        let salt_pass = BCRYPT.genSaltSync(SALTROUNDS);
        hashed_pass = BCRYPT.hashSync(body.password, salt_pass);
      }

      let result = await client.users.update({
        where: {
          email: body.email
        },
        data: {
          name: body.name,
          otp: body.otp,
          pass_reset_token: body.reset_token,
          socket_id: body.socket_id,
          user_agent: body.user_agent,
          password: hashed_pass,
        }
      });
      return result;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },
  deleteUser: async (id) => {
    try {
      let result = await client.users.update({
        where: {
          id: Number(id)
        },
        data: {
          isDeleted: true
        }
      });
      return result;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  }
};

module.exports = USERS;