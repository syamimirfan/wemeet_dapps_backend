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

    const sqlIsBooked = "SELECT s.studName, s.matricNo, b.* FROM student s, booking b WHERE time = ? AND date = ? AND staffNo = ? AND s.matricNo = b.matricNo AND b.statusBooking <> 'Rejected'";
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
                        res.send(JSON.stringify({ success: false, message: err}));
                    } else {               
                        res.send(JSON.stringify({ success: true, message: "Create Booking Successfully", booking: data }));  
                    }
                });
            }
        }
    });

});

//get booked slot
router.route('/booked/:staffNo/:date').get((req, res) => {
    var date = req.params.date;
    var staffNo = req.params.staffNo;


    const sql = "SELECT statusBooking, date, time from booking WHERE staffNo = ? AND  date = ?";

    db.query(sql, [staffNo, date], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, booking: data }));
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//get appointment request in lecturer homepage
router.route('/appointmentrequest/:staffNo').get((req, res) => {
    var staffNo = req.params.staffNo;

    const sql = "SELECT s.*, b.* FROM booking b, student s WHERE b.staffNo = ? AND b.statusBooking = 'Appending' AND b.matricNo = s.matricNo";

    db.query(sql, [staffNo], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, booking: data }));
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//get all booking appointment for manage appointment in student
router.route('/studentbooking/:matricNo').get((req, res) => {
    var matricNo = req.params.matricNo;

    const sql = "SELECT l.staffNo, l.lecturerName, l.lecturerImage, b.* FROM lecturer l , booking b WHERE b.matricNo = ? AND b.staffNo = l.staffNo";

    db.query(sql, [matricNo], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, booking: data }));
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

// reject appointment request
router.route('/reject/:bookingId').patch((req, res) => {
    var bookingId = req.params.bookingId;

    const sql = "UPDATE booking SET statusBooking = 'Rejected' WHERE bookingId = ?";
    const sqlRejected = "SELECT matricNo, staffNo FROM booking WHERE bookingId = ?"

    db.query(sql, [bookingId], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.affectedRows > 0) {
                db.query(sqlRejected, [bookingId], function(err,data) {
                    if(err) {
                        res.send(JSON.stringify({ success: false, message: err }));
                    }else {
                        if(data.length > 0) {
                            res.send(JSON.stringify({ success: true, message: "Reject Appointment", booking: data }));  

                        }else {
                            res.send(JSON.stringify({ success: true, message: "Empty Data" }));
                        }
                    }
                });
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

// accept appointment request
router.route('/accept/:bookingId').patch((req, res) => {
    var bookingId = req.params.bookingId;

    const sql = "UPDATE booking SET statusBooking = 'Accepted' WHERE bookingId = ?";
    const sqlAccepted = "SELECT matricNo, staffNo FROM booking WHERE bookingId = ?"

    db.query(sql, [bookingId], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.affectedRows > 0) {
                db.query(sqlAccepted, [bookingId], function(err,data) {
                    if(err) {
                        res.send(JSON.stringify({ success: false, message: err }));
                    }else {
                        if(data.length > 0) {
                            res.send(JSON.stringify({ success: true, message: "Accepted Appointment", booking: data }));  

                        }else {
                            res.send(JSON.stringify({ success: true, message: "Empty Data" }));
                        }
                    }
                });
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//get all accepted booking appointment for manage appointment and manage attendance in lecturer
router.route('/lecturerbooking/:staffNo').get((req, res) => {
    var staffNo = req.params.staffNo;

    const sql = "SELECT s.matricNo, s.studName , s.studImage, b.* FROM student s , booking b WHERE b.staffNo = ? AND b.statusBooking = 'Accepted'AND b.matricNo = s.matricNo";

    db.query(sql, [staffNo], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, booking: data }));
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//update booking appointment in student
router.route('/updatebooking/:bookingId').patch((req, res) => {
    var bookingId = req.params.bookingId;
    var staffNo = req.body.staffNo;
    var numberOfStudents = req.body.numberOfStudents;
    var date = req.body.date;
    var time = req.body.time;

    const sqlIsBooked = "SELECT s.studName, s.matricNo, b.* FROM student s, booking b WHERE time = ? AND date = ? AND staffNo = ? AND s.matricNo = b.matricNo AND b.statusBooking <> 'Rejected'";
    const sql = "UPDATE booking SET numberOfStudents = ?, date = ?, time = ? WHERE bookingId = ?";
    const sqlUpdate = "SELECT matricNo, staffNo FROM booking WHERE bookingId = ?";

    db.query(sqlIsBooked, [time, date, staffNo], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, student: data, message: "Slot Booked" }));
            } else {
                db.query(sql, [numberOfStudents, date, time, bookingId], function(err, data) {
                    if (err) {
                        res.send(JSON.stringify({ success: false, message: err }));
                    } else {
                        if (data.affectedRows > 0) {
                           
                            db.query(sqlUpdate, [bookingId], function(err,data) {
                                if(err) {
                                    res.send(JSON.stringify({ success: false, message: err }));
                                }else {
                                    if(data.length > 0) {
                                        res.send(JSON.stringify({ success: true, message: "Update Appointment Successfully", booking: data }));  
            
                                    }else {
                                        res.send(JSON.stringify({ success: true, message: "Empty Data" }));
                                    }
                                }
                            });


                        } else {
                            res.send(JSON.stringify({ success: true, message: "Empty Data" }));
                        }

                    }
                });
            }
        }
    });

})

//update booking appointment for number of student and same date
router.route('/updatenostudents/:bookingId').patch((req, res) => {
    var bookingId = req.params.bookingId;
    var numberOfStudents = req.body.numberOfStudents;

    const sql = "UPDATE booking SET numberOfStudents = ? WHERE bookingId = ?";
    const sqlUpdate = "SELECT matricNo, staffNo FROM booking WHERE bookingId = ?";

    db.query(sql, [numberOfStudents, bookingId], function(err,data) {
        if(err){
            res.send(JSON.stringify({ success: false, message: err }));
        }else {
            if (data.affectedRows > 0) {                        
                db.query(sqlUpdate, [bookingId], function(err,data) {
                    if(err) {
                        res.send(JSON.stringify({ success: false, message: err }));
                    }else {
                        if(data.length > 0) {
                            res.send(JSON.stringify({ success: true, message: "Update No of Student Appointment Successfully", booking: data }));  

                        }else {
                            res.send(JSON.stringify({ success: true, message: "Empty Data" }));
                        }
                    }
                });


            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//get booking appointment by id
router.route('/getbookingappointment/:bookingId').get((req, res) => {
    var bookingId = req.params.bookingId;

    const sql = "SELECT * FROM booking WHERE bookingId = ?";

    db.query(sql, [bookingId], function (err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if(data.length > 0) {
                res.send(JSON.stringify({ success: true, booking: data }));
            }else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    })
})

//delete booking appointment in student and lecturer
router.route('/deletebooking/:bookingId').delete((req, res) => {
    var bookingId = req.params.bookingId;

    const sql = "DELETE FROM booking WHERE bookingId = ?";
    const sqlCancelled = "SELECT matricNo, staffNo FROM booking WHERE bookingId = ?"


            db.query(sqlCancelled, [bookingId], function(err,data) {
                if(err) {
                    res.send(JSON.stringify({ success: false, message: err }));
                }else {
                    if(data.length > 0) {
                        db.query(sql, [bookingId], function(err) {
                            if (err) {
                                res.send(JSON.stringify({ success: false, message: err }));
                            } else {
                                res.send(JSON.stringify({ success: true, message: "Delete Appointment Successfully", booking: data }));  
                            }
                        });   
                       
                    }else {
                        res.send(JSON.stringify({ success: true, message: "Empty Data" }));
                    }
                }   
            })
   
});

//to delete booking rejected appointment
router.route('/deleterejectedappointment/:bookingId').delete((req, res) => {
    var bookingId = req.params.bookingId;

    const sql = "DELETE FROM booking WHERE bookingId = ?";

    db.query(sql, [bookingId], function(err) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.send(JSON.stringify({ success: true, message: "Booking Appointment Deleted" }));
        }
    });
});

module.exports = router;