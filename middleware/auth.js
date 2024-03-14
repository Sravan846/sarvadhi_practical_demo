const jwt = require("jsonwebtoken");
const register = require('../models/user');

const verifytoken = async function checkUserOrAdmin(req, res, next) {
  const token = req.body.token || req.query.token || req.header['x-access-token'] || req.header('authorization')
  if (!token) {
    return res.status(400).send({ message: "Token is required" })

  }
  const beareToken = token.split(" ")[1]
  try {
    jwt.verify(beareToken, process.env.TOKEN_CODE, async (err, verifyUser) => {
      if (err) {
        return res.status(400).send({ message: err.message })
      }
      const user = await register.findOne({ _id: verifyUser.data._id })
      if (!user) {
        return res.status(400).send({ message: "This user is not exist" })
      }
      req.user = user
      next()
    })
  } catch (error) {
    return res.status(203).send({ message: err.message })
  }
}

module.exports = verifytoken;
