const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = "helmet";
const cookieParser = require("cookie-parser");

const {environment} = require("config");
const isProduction = environment === "production";
const app = express();
const routes = require('./routes');

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(routes);

// -- Security Middleware --
if (!isProduction) {
  // enable CORS only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure the app
app.use(
  helmet.crossOriginResourcePolicy({

    policy: "cross-origin",
  })
);

// Sets the _csrf token and creates req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);
