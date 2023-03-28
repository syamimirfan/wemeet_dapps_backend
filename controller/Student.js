const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.route('/view').get((req, res) => {
    const sql = 'SELECT * FROM student ';
    db.query(sql, (err, data) => {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.send(JSON.stringify({ success: true, student: data }));
        }
    })
})

//student login backend
router.route('/studentlogin').post((req, res) => {

    var studEmail = req.body.studEmail;
    var studPassword = req.body.studPassword;

    const sql = "SELECT * FROM student WHERE studEmail=? AND studPassword=?";

    if (studEmail != "" && studPassword != "") {
        db.query(sql, [studEmail, studPassword], function(err, data) {
            if (err) {
                res.send(JSON.stringify({ success: false, message: err }));

            } else {
                if (data.length > 0) {
                    res.send(JSON.stringify({ success: true, student: data, status: data[0]['status'], tokenAddress: data[0]['tokenAddress'] }));
                } else {
                    res.send(JSON.stringify({ success: false, message: 'Empty Data' }));
                }
            }
        });
    } else {
        res.send(JSON.stringify({ success: false, message: 'Email and password required!' }));
    }

});

//student sign up backend
router.route('/addstudent').post((req, res) => {
    var matricNo = req.body.matricNo;
    var icNumber = req.body.icNumber;
    var studName = req.body.studName;
    var studTelephoneNo = req.body.studTelephoneNo;
    var studEmail = req.body.studEmail;
    var studPassword = icNumber;
    var faculty = req.body.faculty;
    var program = req.body.program;
    var studImage = req.body.studImage;
    var studImageFirebase = req.body.studImageFirebase;

    //create query
    const sqlQuery = "INSERT INTO student( matricNo, icNumber, tokenAddress, studName, studTelephoneNo, studEmail, studPassword, studImage, studImageFirebase, faculty, program, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

    //call database to insert so add or include database
    db.query(sqlQuery, [matricNo, icNumber, "", studName, studTelephoneNo, studEmail, studPassword, studImage, studImageFirebase, faculty, program, 1], function(error, data) {
        if (error) {
            // if error send response here
            res.send(JSON.stringify({ success: false, message: error, image: studImageFirebase, messageDuplicated: true }));
        } else {
            // if success send response here
            res.send(JSON.stringify({ success: true, message: 'Student Registered' }));
        }
    });

});

//reset password backend
router.route('/resetpassword').patch((req, res) => {
    var studEmail = req.body.studEmail;
    var studPassword = req.body.studPassword;

    const sql = "UPDATE student SET studPassword = ? WHERE studEmail = ?";

    db.query(sql, [studPassword, studEmail], function(error) {
        if (error) {
            res.send(JSON.stringify({ success: false, message: error }));
        } else {
            res.send(JSON.stringify({ success: true, message: "Password Successfully Update" }));
        }
    });
});

//to get studImage link from database to counter the file same name from firebase
router.route('/getimage/:matricNo').get((req, res) => {
    var matricNo = req.params.matricNo;

    const sql = "SELECT studImageFirebase FROM student WHERE matricNo=?";

    db.query(sql, [matricNo], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.json(data[0]);
        }
    })
});

//to update link image for studImage from firebase
router.route('/updateimage/:matricNo').patch((req, res) => {
    var matricNo = req.params.matricNo;
    var studImage = req.body.studImage;

    const sql = "UPDATE student SET studImage = ? WHERE matricNo=?";

    db.query(sql, [studImage, matricNo], function(err) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.send(JSON.stringify({ success: true, message: "studImage Successfully Update" }));
        }
    })
});

//get student detail by passing matricNo
router.route('/getstudent/:matricNo').get((req, res) => {
    var matricNumber = req.params.matricNo;
    const sql = "SELECT * FROM student WHERE matricNo = ?";

    db.query(sql, [matricNumber], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                //student: data is VERY IMPORTANT!!
                //IF NOT WE CANNOT PASS TO THE FLUTTER OBJECT 
                //e.g studentResponse['student'][0]['matricNo'];
                res.send(JSON.stringify({ success: true, student: data }));
            } else {
                res.send(JSON.stringify({ success: false, message: "User Not Found" }));
            }

        }
    });
})

//get lecturer for homepage
router.route('/lecturer').get((req, res) => {
    const sql = "SELECT * FROM lecturer";
    db.query(sql, function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, lecturer: data }));
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//get lecturer information for see more in homepage
router.route('/lecturerinformation/:staffNo').get((req, res) => {
    var staffNo = req.params.staffNo;

    const sql = "SELECT l.*, lf.* FROM lecturer l, lecturer_information lf WHERE l.staffNo = ? AND l.staffNo = lf.staffNo";

    db.query(sql, [staffNo], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, lecturer: data }));
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//update token address when student is first time login
router.route('/updatetoken/:matricNo').patch((req, res) => {
    var matricNo = req.params.matricNo;
    var tokenAddress = req.body.tokenAddress;

    const sql = "UPDATE student SET tokenAddress = ? WHERE matricNo = ?";

    db.query(sql, [tokenAddress, matricNo], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.affectedRows > 0) {
                res.send(JSON.stringify({ success: true, message: "Token Address Successfully Update" }));
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//get count of student in admin
router.route('/totalstudent').get((req, res) => {
    const sql = "SELECT COUNT(*) FROM student";

    db.query(sql, function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, student: data }));
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//select student for recent student in admin
router.route('/recentstudent').get((req, res) => {
    const sql = "SELECT * FROM student";
    db.query(sql, function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, student: data }));
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//delete student account in admin
router.route('/deletestudent/:matricNo').delete((req, res) => {
    var matricNo = req.params.matricNo;

    const sql = "DELETE FROM student WHERE matricNo=?";

    db.query(sql, [matricNo], function(err) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.send(JSON.stringify({ success: true, message: "Account Successfully Deleted" }));
        }
    });
});



module.exports = router;