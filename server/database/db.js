import mysql2 from 'mysql2';

export const connection = mysql2.createConnection({
    host: 'localhost',       // Cambia por la dirección de tu base de datos
    user: 'root',      // Tu nombre de usuario en MySQL
    password: 'root', // Tu contraseña en MySQL
    database: 'gestion_sede' // El nombre de la base de datos
});

export const connectionDemo = mysql2.createConnection({
    host: 'localhost',       // Cambia por la dirección de tu base de datos
    user: 'root',      // Tu nombre de usuario en MySQL
    password: 'root', // Tu contraseña en MySQL
    database: 'gestion_demo' // El nombre de la base de datos
});
