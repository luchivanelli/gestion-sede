import { connection, connectionDemo } from "../database/db.js";

export const addPayment = (req, res) => {
    //A partir de middleware, obtenemos el tipo de usuario para verificar en que bd hay que hacer la conexion
    const db = req.user.tipo === "demo" ? connectionDemo : connection;
    const {
        nombre_completo,
        fecha,
        monto
    } = req.body;

    db.query(`INSERT INTO cuotas (nro_socio, fecha, monto) 
        VALUES (?, ?, ?)`,
        [nombre_completo, fecha, monto], (err, result) => {
            if (err) return res.status(500).json({ error: "Error en la consulta" });
            res.json(result);
    });
};