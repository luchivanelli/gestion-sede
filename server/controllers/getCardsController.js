import { connection, connectionDemo } from "../database/db.js";

export const getCards = (req, res) => {
    //A partir de middleware, obtenemos el tipo de usuario para verificar en que bd hay que hacer la conexion
    const db = req.user.tipo === "demo" ? connectionDemo : connection;

    db.query("SELECT * FROM tarjetas", (err, result) => {
        if (err) return res.status(500).json({ error: "Error en la consulta" });
        res.json(result);
    });
};