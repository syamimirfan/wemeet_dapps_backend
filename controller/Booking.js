const express = require('express');
const router = express.Router();
const db = require('../config/db');

//get slot for specific lecturer
router.route('/slot/:staffNo/:day').get((req, res) => {
    var day = req.params.day;
    var staffNo = req.params.staffNo;
    var inputDay = '%' + day.substring(0, 3) + '%';

    const sql = "SELECT * from slot WHERE staffNo = ? AND  day LIKE ?";

    db.query(sql, [staffNo, inputDay], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, slot: data }));
            } else {
                res.send(JSON.stringify({ success: true, message: "" }));
            }
        }
    });
});

//create booking for lecturer
router.route('/addbook').post((req, res) => {
    var matricNo = req.body.matricNo;
    var staffNo = req.body.staffNo;
    var numberOfStudents = req.body.numberOfStudents;
    var date = req.body.date;
    var time = req.body.time;

    const sqlIsBooked = "SELECT s.studName, s.matricNo, b.* FROM student s, booking b WHERE time = ? AND date = ? AND staffNo = ?";
    const sql = "INSERT INTO booking(matricNo, staffNo, numberOfStudents, date, time, statusBooking) VALUES(?,?,?,?,?,?)";

    db.query(sqlIsBooked, [time, date, staffNo], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, student: data, message: "Slot Booked" }));
            } else {
                db.query(sql, [matricNo, staffNo, numberOfStudents, date, time, "Appending"], function(err) {
                    if (err) {
                        res.send(JSON.stringify({ success: false, message: err }));
                    } else {
                        res.send(JSON.stringify({ success: true, message: "Booking Successfully Added" }));
                    }
                });
            }
        }
    });
    // db.query(sql, [matricNo, staffNo, numberOfStudents, date, time, "Appending"], function(err) {
    //     if (err) {
    //         res.send(JSON.stringify({ success: false, message: err }));
    //     } else {
    //         res.send(JSON.stringify({ success: true, message: "Booking Successfully Added" }));
    //     }
    // });
});

module.exports = router;