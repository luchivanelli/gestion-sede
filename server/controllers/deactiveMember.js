import { connection, connectionDemo } from "../database/db.js";

export const deactiveMember = (req, res) => {
    const db = req.user.tipo === "demo" ? connectionDemo : connection;
    const { id } = req.params;
    const { estado } = req.body;

    db.query(
        `UPDATE socios SET estado = ? WHERE nro_socio = ?`,
        [estado, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Error en la consulta" });
            res.json(result);
        }
    );
};