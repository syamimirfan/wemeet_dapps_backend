const express = require('express');
const router = express.Router();
const db = require('../config/db');

//post transaction hash
router.route('/transaction').post((req, res) => {
    var matricNo = req.body.matricNo;
    var trackingHash = req.body.trackingHash;

    const sql = "INSERT INTO hash(matricNo, trackingHash) VALUES(?,?)";

    db.query(sql, [matricNo, trackingHash], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.send(JSON.stringify({ success: true, message: "Transaction Hash Saved" }));
        }
    });
});

//get all transaction
router.route('/gettransaction').get((req, res) => {
    const sql = "SELECT s.matricNo, s.studName, s.studTelephoneNo, h.hashId , h.trackingHash FROM student s, hash h  WHERE s.matricNo = h.matricNo";

    db.query(sql, function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, hash: data }));
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//delete transaction
router.route('/deletetransaction/:hashId').delete((req, res) => {
    var hashId = req.params.hashId;

    const sql = "DELETE FROM hash WHERE hashId = ?";

    db.query(sql, [hashId], function(err) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.send(JSON.stringify({ success: true, message: "Hash Deleted" }));
        }
    });
});

module.exports = router;