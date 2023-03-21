const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { route } = require('./Lecturer');

//add the slot
router.route('/addslot/:staffNo').post((req, res) => {
    var staffNumber = req.params.staffNo;
    var days = req.body.day;
    var slotOne = req.body.slot1;
    var slotTwo = req.body.slot2;
    var slotThree = req.body.slot3;
    var slotFour = req.body.slot4;
    var slotFive = req.body.slot5;

    const sqlDuplicate = "SELECT * FROM slot WHERE staffNo = ? and day = ?";

    const sql = "INSERT INTO slot(staffNo, day, slot1, slot2, slot3, slot4, slot5) VALUES (?,?,?,?,?,?,?)";


    db.query(sqlDuplicate, [staffNumber, days], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, message: "Slot already exists" }));
            } else {
                db.query(sql, [staffNumber, days, slotOne, slotTwo, slotThree, slotFour, slotFive], function(err) {
                    if (err) {
                        res.send(JSON.stringify({ success: false, message: err }));
                    } else {
                        res.send(JSON.stringify({ success: true, message: "Slot Inserted!" }));
                    }
                });
            }
        }
    });

    // db.query(sql, [staffNumber, days, slotOne, slotTwo, slotThree, slotFour, slotFive], function(err) {
    //     if (err) {
    //         res.send(JSON.stringify({ success: false, message: err }));
    //     } else {
    //         res.send(JSON.stringify({ success: true, message: "Slot Inserted!" }));
    //     }
    // });
});

//update the slot
router.route('/editslot/:staffNo').patch((req, res) => {
    var staffNumber = req.params.staffNo;
    var days = req.body.day;
    var slotOne = req.body.slot1;
    var slotTwo = req.body.slot2;
    var slotThree = req.body.slot3;
    var slotFour = req.body.slot4;
    var slotFive = req.body.slot5;

    const sql = "UPDATE slot SET slot1 = ?, slot2 = ?, slot3 = ?, slot4 = ?, slot5 = ? WHERE staffNo = ? AND day = ? ";

    db.query(sql, [slotOne, slotTwo, slotThree, slotFour, slotFive, staffNumber, days], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.affectedRows > 0) {
                res.send(JSON.stringify({ success: true, message: "Slot Successfully Update" }));
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }

        }
    });
});

//delete all the slot
router.route('/deleteslot').delete((req, res) => {
    const sql = "DELETE FROM slot";
    db.query(sql, function(err) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.send(JSON.stringify({ success: true, message: "All Slot Delete" }));
        }
    });
});

//get specific day slot
router.route('/getslot/:staffNo').get((req, res) => {
    var staffNumber = req.params.staffNo;

    const sql = "SELECT * FROM slot WHERE staffNo = ?";
    db.query(sql, [staffNumber], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, slot: data }));
            } else {
                res.send(JSON.stringify({ success: true, message: "No Slot Available" }));
            }
        }
    });
});

module.exports = router;