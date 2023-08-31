// backend/utils/auth.js
// import necessary Auth Midlleware components
const jwt = require("jsonwebtoken");
const {jwtConfig} = require("../config");
const {User} = require("../db/models");

const {secret, expiresIn} = jwtConfig;

/* -- Sends a JWT Cookie after sign-up/login -- */
const setTokenCookie = (res, user) => {
  // Create the token
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  const token = jwt.sign(
    {data: safeUser},
    secret,
    {expiresIn: parseInt(expiresIn)} // 604,800 seconds = 1wk
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie("token", token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token;
};

/* -- Restores the session-user based on the contents of the JWT cookie -- */
const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const {token} = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const {id} = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ["email", "createdAt", "updatedAt"],
        },
      });
    } catch (e) {
      res.clearCookie("token");
      return next();
    }

    if (!req.user) res.clearCookie("token");

    return next();
  });
};

/* --Requires user to be authenticated before accessing a route -- */
const requireAuth = function (req, _res, next) {

  if (req.user) return next();

  const err = new Error("Authentication required");
  err.title = "Authentication required";
  err.errors = {message: "Authentication required"};
  err.status = 401;
  return next(err);
};

// export all functions created
module.exports = { setTokenCookie, restoreUser, requireAuth };
