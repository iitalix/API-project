// backend/routes/api/session.js
const express = require("express");
const {Op} = require("sequelize");
const bcrypt = require("bcryptjs");

const {setTokenCookie, restoreUser} = require("../../utils/auth");
const {User} = require("../../db/models");
const {check} = require("express-validator");
const {handleValidationErrors} = require("../../utils/validation");

const router = express.Router();

// checks if credential and password keys are empty
const validateLogin = [
  check("credential")
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage("Please provide a valid email or username."),
  check("password")
    .exists({checkFalsy: true})
    .withMessage("Please provide a password."),
  handleValidationErrors,
];

/* -- Log in -- */
router.post("/", validateLogin, async (req, res, next) => {
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

/* -- Restore session user -- */
router.get("/", (req, res) => {
  const {user} = req;
  if (user) {
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    return res.json({
      user: safeUser,
    });
  } else return res.json({user: null});
});

module.exports = router;
