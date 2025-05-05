import { connection, connectionDemo } from "../database/db.js";

export const deletePayment = (req, res) => {
    const db = req.user.tipo === "demo" ? connectionDemo : connection;
    const { id } = req.params;

    db.query(
        `DELETE FROM cuotas WHERE id_cuota = ?`,
        [id],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Error en la consulta" });
            res.json(result);
        }
    );
};