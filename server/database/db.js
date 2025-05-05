import mysql2 from 'mysql2';

export const connection = mysql2.createConnection({
    host: 'bfp9b7bqgwhm0nrgvgow-mysql.services.clever-cloud.com',
    user: 'uomyffhmlqjv6gpx',
    password: 'yl2CbWjZ6SGS5A8bGpj5',
    database: 'bfp9b7bqgwhm0nrgvgow'
});

export const connectionDemo = mysql2.createConnection({
    host: 'bfp9b7bqgwhm0nrgvgow-mysql.services.clever-cloud.com',
    user: 'uomyffhmlqjv6gpx',
    password: 'yl2CbWjZ6SGS5A8bGpj5',
    database: 'bfp9b7bqgwhm0nrgvgow'
});
