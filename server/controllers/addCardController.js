import { connection, connectionDemo } from "../database/db.js";

export const addCard = (req, res) => {
    //A partir de middleware, obtenemos el tipo de usuario para verificar en que bd hay que hacer la conexion
    const db = req.user.tipo === "demo" ? connectionDemo : connection;
    const {
        nombre_completo,
        tipo_tarjeta,
        nro_tarjeta,
        vencimiento,
        cod_seguridad,
    } = req.body;

    db.query(`INSERT INTO tarjetas (nro_socio, tipo_tarjeta, nro_tarjeta, vencimiento, cod_seguridad) 
        VALUES (?, ?, ?, ?, ?)`,
        [nombre_completo, tipo_tarjeta, nro_tarjeta, vencimiento, cod_seguridad], (err, result) => {
            if (err) return res.status(500).json({ error: "Error en la consulta" });
            res.json(result);
    });
};