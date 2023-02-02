import express from "express";
import myconnection from "express-myconnection";
import mysql from "mysql";
import session from "express-session";
import bodyParser from "body-parser";
import routes from "./routes/routes.js";
import {
  PORT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} from "./config.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  myconnection(mysql, {
    host: DB_HOST,
    user: DB_USER,
    password:   DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME,
  })
);

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(routes);

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
