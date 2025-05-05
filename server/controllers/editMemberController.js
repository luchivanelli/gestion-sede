import { connection, connectionDemo } from "../database/db.js";

export const editMember = (req, res) => {
    // A partir de middleware, obtenemos el tipo de usuario para verificar en qué BD hay que hacer la conexión
    const db = req.user.tipo === "demo" ? connectionDemo : connection;
    const { id } = req.params;

    const {
        nombre_completo,
        dni,
        ciudad,
        direccion,
        id_forma_pago,
        estado
    } = req.body;

    db.query(`UPDATE socios SET nombre_completo = ?, dni = ?, direccion = ?, ciudad = ?, id_forma_pago = ?, estado = ?
        WHERE nro_socio = ?`,
        [nombre_completo, dni, direccion, ciudad, id_forma_pago, estado, id], (err, result) => {
            if (err) return res.status(500).json({ error: "Error en la consulta" });
            res.json(result);
        });
};
