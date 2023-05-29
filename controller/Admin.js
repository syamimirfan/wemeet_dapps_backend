const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

router.route('/login').post((req, res) => {
    var password = req.body.password;

    const sql = "SELECT * FROM admin ";

    if (password !== "") {
        db.query(sql, [password], function(err, data) {
            if (err) {
                res.send(JSON.stringify({ success: false, message: err }));
            } else {
                if (data.length > 0) {
                    // Verify password using bcrypt
                    bcrypt.compare(password, data[0].password, function(err, result) {
                        if (err) {
                            res.send(JSON.stringify({ success: false, message: err }));
                        } else if (result) {
                            res.send(JSON.stringify({ success: true, admin: password }));
                        } else {
                            res.send(JSON.stringify({ success: false, message: 'Incorrect password' }));
                        }
                    });
                } else {
                    res.send(JSON.stringify({ success: false, message: 'Empty Data' }));
                }
            }
        });
    } else {
        res.send(JSON.stringify({ success: false, message: 'Password required!' }));
    }
});


module.exports = router;