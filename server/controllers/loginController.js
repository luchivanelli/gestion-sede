import { connection, connectionDemo } from "../database/db.js";
import jwt from "jsonwebtoken";

export const login = (req, res) => {
  const { username, password } = req.body;
  const consult = "SELECT * FROM login WHERE usuario = ? AND contraseña = ?";

  // Primero consultamos en la base real
  connection.query(consult, [username, password], (err, result) => {
    if (err) return res.status(500).send({ error: "Error en la base real" });

    if (result.length > 0) {
      const token = jwt.sign({ username, tipo: "real" }, "Stack", {
        expiresIn: "50m",
      });
      return res.json({ token, tipo: "real" }); //si el usuario exite, acá se corta la ejecución
    }

    // Si no existe en la real, consultamos en la demo
    connectionDemo.query(consult, [username, password], (err, result) => {
      if (err) return res.status(500).send({ error: "Error en la base demo" });

      if (result.length > 0) {
        const token = jwt.sign({ username, tipo: "demo" }, "Stack", {
          expiresIn: "50m",
        });
        return res.json({ token, tipo: "demo" });
      } else {
        return res.send({ message: "El usuario no existe" });
      }
    });
  });
};
