import express from 'express';
import cors from 'cors';
import { connection } from './database/db.js';
import { router } from './api/endpoints.js';

const app = express();
const PORT = 5000;

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos con el id ' + connection.threadId);
});

app.use(cors({
  origin: ["http://localhost:5173", "https://gestion-sede.vercel.app"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

//Permite que funcione el "req.body" en los controllers
app.use(express.json());

//Establece el uso de todos endpoints (rutas)
app.use("/", router)

app.get("/", (req, res) => {
  connection.query('SELECT * FROM socios', (err, results) => {
    if (err) {
      console.error('Error en la consulta: ' + err.stack);
      return;
    }
    res.json(results);
  });
});

// Servir archivos estáticos de frontend
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Redirigir todas las rutas no definidas (para SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

export default app;