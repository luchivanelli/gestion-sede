import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]; // extrae el token del header

  if (!token)
    return res.status(401).json({ error: "Token no proporcionado" });

  jwt.verify(token, "Stack", (err, decoded) => {
    if (err)
      return res.status(403).json({ error: "Token inválido o expirado" });

    req.user = decoded; // guarda los datos del token para usarlos en la ruta
    // req.user contiene {username: "...", tipo: "..."}
    next(); // permite que se ejecute el controller (si el token fue válido)
  });
};