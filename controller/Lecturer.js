const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.route('./view').get((req, res) => {

    const sql = "SELECT * FROM lecturer";

    db.query(sql, (err, data) => {
        if (err) {
            res.error(err.sqlMessage, res);
        } else {
            res.status(200).json({
                success: true,
                lecturer: data
            })
        }
    })
})

//lecturer sign up backend
router.route('/addlecturer').post((req, res) => {
    var staffNo = req.body.staffNo;
    var lecturerName = req.body.lecturerName;
    var icNumber = req.body.icNumber;
    var lecturerTelephoneNo = req.body.lecturerTelephoneNo;
    var lecturerEmail = req.body.lecturerEmail;
    var lecturerPassword = icNumber;
    var faculty = req.body.faculty;
    var department = req.body.department;
    var lecturerImage = req.body.lecturerImage;
    var lecturerImageFirebase = req.body.lecturerImageFirebase

    const sql = "INSERT INTO lecturer(staffNo, lecturerName, icNumber, lecturerTelephoneNo,lecturerEmail,lecturerPassword, lecturerImage, lecturerImageFirebase,faculty, department, status) VALUES(?,?,?,?,?,?,?,?,?,?,?)";

    db.query(sql, [staffNo, lecturerName, icNumber, lecturerTelephoneNo, lecturerEmail, lecturerPassword, lecturerImage, lecturerImageFirebase, faculty, department, 2], function(error, data, fields) {
        if (error) {
            res.send(JSON.stringify({ success: false, message: error }));
        } else {
            res.send(JSON.stringify({ success: true, message: "Lecturer Registered" }));
        }
    })
})

//to get lecturerImage link from database to counter the file same name from firebase
router.route('/getimage/:staffNo').get((req, res) => {
    var staffNo = req.params.staffNo;

    var sql = "SELECT lecturerImageFirebase FROM lecturer WHERE staffNo=?";

    db.query(sql, [staffNo], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.json(data[0]);
        }
    })
});

//to update link image for lecturerImage from firebase
router.route('/updateimage/:staffNo').patch((req, res) => {
    var staffNo = req.params.staffNo;
    var lecturerImage = req.body.lecturerImage;

    var sql = "UPDATE lecturer SET lecturerImage = ? WHERE staffNo=?";

    db.query(sql, [lecturerImage, staffNo], function(err) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.send(JSON.stringify({ success: true, message: "lecturerImage Successfully Update" }));
        }
    })
});


//lecturer login backend
router.route('/lecturerlogin').post((req, res) => {
    var lecturerEmail = req.body.lecturerEmail;
    var lecturerPassword = req.body.lecturerPassword;

    const sql = "SELECT * FROM lecturer WHERE lecturerEmail=? AND lecturerPassword=?";

    if (lecturerEmail != "" && lecturerPassword != "") {
        db.query(sql, [lecturerEmail, lecturerPassword], function(error, data, fields) {
            if (error) {
                res.send(JSON.stringify({ success: false, message: error }));
            } else {
                if (data.length > 0) {
                    res.send(JSON.stringify({ success: true, lecturer: data, status: data[0]['status'] }));
                } else {
                    res.send(JSON.stringify({ success: false, message: "Empty Data" }));
                }
            }
        });
    } else {
        res.send(JSON.stringify({ sucess: false, message: "Email and password required" }))
    }
})

//reset password backend
router.route('/resetpassword').patch((req, res) => {
    var lecturerEmail = req.body.lecturerEmail;
    var lecturerPassword = req.body.lecturerPassword;

    var sql = "UPDATE lecturer SET lecturerPassword = ? WHERE lecturerEmail = ?";

    db.query(sql, [lecturerPassword, lecturerEmail], function(error) {
        if (error) {
            res.send(JSON.stringify({ success: false, message: error }));
        } else {
            res.send(JSON.stringify({ success: true, message: "Password Successfully Update" }));
        }
    });
});

//delete lecturer account 
router.route('/deletelecturer/:matricNo').delete((req, res) => {
    var staffNo = req.params.staffNo;

    var sql = "DELETE * FROM lecturer WHERE staffNo=?";

    db.query(sql, [staffNo], function(err) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.send(JSON.stringify({ success: true, message: "Account Successfully Deleted" }));
        }
    });
});

//get lecturer detail by passing staffNo
router.route('/getlecturer/:staffNo').get((req, res) => {
    var staffNumber = req.params.staffNo;
    const sql = "SELECT * FROM lecturer WHERE staffNo = ?";

    db.query(sql, [staffNumber], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                //lecturer: data is VERY IMPORTANT!!
                //IF NOT WE CANNOT PASS TO THE FLUTTER OBJECT 
                //e.g lecturerResponse['lecturer'][0]['staffNo'];
                res.send(JSON.stringify({ success: true, lecturer: data }));
            } else {
                res.send(JSON.stringify({ success: false, message: "User Not Found" }));
            }

        }
    });
})


module.exports = router;