const express = require('express');
var mysql = require('mysql');
require("dotenv").config();

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    charset: 'utf8mb4', //to input the emoji inside chat
});


connection.connect(function(err) {
    if (err) throw err;
    console.log('db connected');
});


module.exports = connection;