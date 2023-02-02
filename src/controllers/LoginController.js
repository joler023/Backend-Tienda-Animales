import bcrypt from "bcrypt";
import connection from "express-myconnection";

const auth = (req, res) => {
  const data = req.body;

  req.getConnection((err, conn) => {
    conn.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [data.email],
      (err, userdata) => {
        if (userdata.length > 0) {
          res
            .status(400)
            .json({ message: "el usuario ya existe !", auth: false });
        } else {
          bcrypt.hash(data.password, 12).then((hash) => {
            data.password = hash;
            req.getConnection((err, conn) => {
              conn.query("INSERT INTO usuarios SET ?", [data], (err, rows) => {
                req.session.loggedin = data.email;
                res
                  .status(200)
                  .json({ message: "usuario creado con exito", auth: true });
              });
            });
          });
        }
      }
    );
  });
};

const login = (req, res) => {
  const data = req.body;

  req.getConnection((err, conn) => {
    conn.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [data.email],
      (err, userdata) => {
        if (userdata.length > 0) {
          req.session.loggedin = data.email;
          userdata.forEach((element) => {
            bcrypt.compare(data.password, element.password, (err, isMatch) => {
              if (!isMatch) {
                res.status(400).json({
                  message: "la contraseña o el usuario no son correctos !",
                  auth: false,
                });
              } else {
                res.status(200).json({ message: "Bienvenido", auth: true });
              }
            });
          });
        } else {
          res
            .status(400)
            .json({ message: "el usuario no existe !", auth: false });
        }
      }
    );
  });
};

export default { auth, login };
