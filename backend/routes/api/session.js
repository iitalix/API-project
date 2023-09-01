// backend/routes/api/session.js
const express = require("express");
const {Op} = require("sequelize");
const bcrypt = require("bcryptjs");

const {setTokenCookie, restoreUser} = require("../../utils/auth");
const {User} = require("../../db/models");

const router = express.Router();

/* -- Log in -- */
router.post("/", async (req, res, next) => {
  // parse the credentials from the request body
  const {credential, password} = req.body;

  //turn off defaultScope and query for the user based on credentials
  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential,
      },
    },
  });

  // if user is not found, or password hash does not match, create login failed error
  // bcrypt.compareSync compares req.body pw with hashed pw
  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Login failed";
    err.errors = {credential: "The provided credentials were invalid."};
    return next(err);
  }

  // if user password correct:
  // (user's non-sensitive information)
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  // set token cookie and return response
  // with user's non-sensitive information
  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});


/* -- Logout -- */
// removes token cookie from the response and returns success message
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({message: "success"});
});

module.exports = router;
