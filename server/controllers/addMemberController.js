import { connection, connectionDemo } from "../database/db.js";

export const addMember = (req, res) => {
    //A partir de middleware, obtenemos el tipo de usuario para verificar en que bd hay que hacer la conexion
    const db = req.user.tipo === "demo" ? connectionDemo : connection;
    const {
        nro_socio,
        nombre_completo,
        dni,
        ciudad,
        direccion,
        id_forma_pago,
        estado
      } = req.body;

    db.query(`INSERT INTO socios (nro_socio, nombre_completo, dni, direccion, ciudad, id_forma_pago, estado) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nro_socio, nombre_completo, dni, direccion, ciudad, id_forma_pago, estado], (err, result) => {
            if (err) return res.status(500).json({ error: "Error en la consulta" });
            res.json(result);
    });
};