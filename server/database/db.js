import mysql2 from 'mysql2';

export const connection = mysql2.createConnection({
    host: 'bwc7fepmbzsls6q6apai-mysql.services.clever-cloud.com',
    user: 'ugzxk5bw9musce1x',
    password: 'wJYadKBRdLgHS1E6ALcU',
    database: 'bwc7fepmbzsls6q6apai'
});

export const connectionDemo = mysql2.createConnection({
    host: 'bfp9b7bqgwhm0nrgvgow-mysql.services.clever-cloud.com',
    user: 'uomyffhmlqjv6gpx',
    password: 'yl2CbWjZ6SGS5A8bGpj5',
    database: 'bfp9b7bqgwhm0nrgvgow'
});
