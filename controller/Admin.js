const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.route('/login').post((req, res) => {
    var password = req.body.password;

    const sql = "SELECT password FROM admin WHERE password=?";

    if (password !== "") {
        db.query(sql, [password], function(err, data) {
            if (err) {
                res.send(JSON.stringify({ success: false, message: err }));
            } else {
                if (data.length > 0) {
                    res.send(JSON.stringify({ success: true, admin: password }));
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