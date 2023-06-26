const express = require('express');
var mysql = require('mysql');
require("dotenv").config();

//or use createConnection
var connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    },
    // socketPath: process.env.INSTANCE_CONNECTION_NAME,
    charset: 'utf8mb4', //to input the emoji inside chat
});


// connection.connect(function(err) {
//     if (err) throw err;
//     console.log('db connected');
// });

connection.getConnection((err, conn) => {
    if (err) {
        console.error('DB connection error:', err);
        return;
    }
    console.log('DB connected successfully!');
    conn.release(); // Release the connection back to the pool
});



module.exports = connection;