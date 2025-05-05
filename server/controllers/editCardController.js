import { connection, connectionDemo } from "../database/db.js";

export const editCard = (req, res) => {
    // A partir de middleware, obtenemos el tipo de usuario para verificar en qué BD hay que hacer la conexión
    const db = req.user.tipo === "demo" ? connectionDemo : connection;
    const { id } = req.params;

    const {
        nro_socio,
        tipo_tarjeta,
        nro_tarjeta,
        vencimiento,
        cod_seguridad,
    } = req.body;

    db.query(`UPDATE tarjetas SET nro_socio = ?, tipo_tarjeta = ?, nro_tarjeta = ?, vencimiento = ?, cod_seguridad = ?
        WHERE id_tarjeta = ?`,
        [nro_socio, tipo_tarjeta, nro_tarjeta, vencimiento, cod_seguridad, id], (err, result) => {
            if (err) return res.status(500).json({ error: "Error en la consulta" });
            res.json(result);
        });
};
