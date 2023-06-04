const express = require('express');
const router = express.Router();
const db = require('../config/db');
const FCM = require("../services/fcm");

//add attendance when student absent appointment from lecturer
router.route('/addattendance/absent').post((req, res) => {
    var matricNo = req.body.matricNo;
    var staffNo = req.body.staffNo;
    var numberOfStudents = req.body.numberOfStudents;
    var date = req.body.date;
    var time = req.body.time;

    const sql = "INSERT INTO attendance(matricNo,staffNo,status,numberOfStudents,date,time,statusReward) VALUES(?,?,?,?,?,?,?)";

    db.query(sql, [matricNo, staffNo, "Absent", numberOfStudents, date, time, "Not Send"], function(err) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
                  //to send notification to specific student
                  const sqlNotificationPerson = "SELECT lecturerName FROM lecturer WHERE staffNo = ?";
                  const sqlNotification = "SELECT firebaseToken FROM student WHERE matricNo = ?";

                  //to get student and firebaseToken 
                  db.query(sqlNotificationPerson, [staffNo], function(err, data) {
                      if(err) {
                         res.send(JSON.stringify({ success: false, message: err }));
                      }else{
                         if(data.length > 0) {
                             const lecturerName = data[0]['lecturerName'];     
                              db.query(sqlNotification,[matricNo], function(err, data) {
                                 if(err){
                                     res.send(JSON.stringify({ success: false, message: err }));
                                 }else {
                                     if(data.length > 0) {
                                         const firebaseToken = data[0]['firebaseToken'];
                                         let message = {
                                             notification: {
                                                 title: "Sorry :) You are absent!!!",
                                                 body: "Dr " + lecturerName + " has sign you absent. No reward will be given. Thank you."
                                             },
                                             token: firebaseToken,
                                          };
                         
                                          FCM.send(message, function(err, data) {
                                             if(err){
                                               return res.send(JSON.stringify({ success: false, message: "Failed to send notification" })); 
                                             }else {
                                               return res.send(JSON.stringify({ success: true, message: "Notification Sent", chat: data }));     
                                             }
                                        });
                                     }
                                 }
                              });
                         } else {
                             res.send(JSON.stringify({ success: true, message: "Empty Data" }));
                         }
                      }
                  });
        }
    });
});

//add attendance when student attend appointment from lecturer
router.route('/addattendance/attend').post((req, res) => {
    var matricNo = req.body.matricNo;
    var staffNo = req.body.staffNo;
    var numberOfStudents = req.body.numberOfStudents;
    var date = req.body.date;
    var time = req.body.time;

    const sql = "INSERT INTO attendance(matricNo,staffNo,status,numberOfStudents,date,time, statusReward) VALUES(?,?,?,?,?,?,?)";

    db.query(sql, [matricNo, staffNo, "Attend", numberOfStudents, date, time, "Not Send"], function(err) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            //to send notification to specific student
            const sqlNotificationPerson = "SELECT lecturerName FROM lecturer WHERE staffNo = ?";
            const sqlNotification = "SELECT firebaseToken FROM student WHERE matricNo = ?";

            //to get student and firebaseToken 
            db.query(sqlNotificationPerson, [staffNo], function(err, data) {
                if(err) {
                   res.send(JSON.stringify({ success: false, message: err }));
                }else{
                   if(data.length > 0) {
                       const lecturerName = data[0]['lecturerName'];     
                        db.query(sqlNotification,[matricNo], function(err, data) {
                           if(err){
                               res.send(JSON.stringify({ success: false, message: err }));
                           }else {
                               if(data.length > 0) {
                                   const firebaseToken = data[0]['firebaseToken'];
                                   let message = {
                                       notification: {
                                           title: "Congratulations, You are attend!!!",
                                           body: "Dr " + lecturerName + " has sign you attend. 1 UTHM Token will transfer to your MetaMask account. Thank you."
                                       },
                                       token: firebaseToken,
                                    };
                   
                                    FCM.send(message, function(err, data) {
                                       if(err){
                                         return res.send(JSON.stringify({ success: false, message: "Failed to send notification" })); 
                                       }else {
                                         return res.send(JSON.stringify({ success: true, message: "Notification Sent", chat: data }));     
                                       }
                                  });
                               }
                           }
                        });
                   } else {
                       res.send(JSON.stringify({ success: true, message: "Empty Data" }));
                   }
                }
            });
        }
    });
});

//get attendance in student
router.route('/getattendance/:matricNo').get((req, res) => {
    var matricNo = req.params.matricNo;

    const sql = "SELECT l.lecturerImage, l.lecturerName, a.* FROM lecturer l, attendance a WHERE matricNo = ? AND l.staffNo = a.staffNo";

    db.query(sql, [matricNo], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, attendance: data }));
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//to delete attendance in student that attend the meeting
router.route('/deleteattendance/:attendanceId').delete((req, res) => {
    var attendanceId = req.params.attendanceId;

    const sql = "DELETE FROM attendance WHERE attendanceId = ?";

    db.query(sql, [attendanceId], function(err) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.send(JSON.stringify({ success: true, message: "Attendance Deleted" }));
        }
    });
})


//get attendance for student that attend the meeting in admin
router.route('/givetoken').get((req, res) => {

    const sql = "SELECT s.*, a.* FROM student s, attendance a WHERE a.status = 'Attend' AND s.matricNo = a.matricNo";

    db.query(sql, function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, attendance: data }));
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//to update status reward
router.route('/statusreward/:attendanceId').patch((req, res) => {
    var attendanceId = req.params.attendanceId;

    const sql = "UPDATE attendance SET statusReward = ? WHERE attendanceId = ?";
    db.query(sql, ["Send", attendanceId], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.affectedRows > 0) {
                res.send(JSON.stringify({ success: true, message: "Status Reward Updated" }));
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    })
});

//to delete booking without sending notification
router.route('/deletebookingattendance/:bookingId').delete((req, res) => {
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