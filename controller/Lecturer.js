const express = require('express');
const router = express.Router();
const db = require('../config/db');

//to view all lecturer and lecturer_information
router.route('/view').get((req, res) => {

    //both can be used
    //const sql = "SELECT lecturer.*, lecturer_information.roomNo, lecturer_information.floorLvl FROM lecturer JOIN lecturer_information ON lecturer.staffNo = lecturer_information.staffNo";
    const sql = "SELECT l.*, lf.roomNo, lf.floorLvl FROM lecturer l, lecturer_information lf WHERE l.staffNo = lf.staffNo";

    db.query(sql, (err, data) => {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.send(JSON.stringify({ success: true, lecturer: data }));
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


    const sql = "INSERT INTO lecturer(staffNo, lecturerName, icNumber, lecturerTelephoneNo,lecturerEmail,lecturerPassword, lecturerImage, lecturerImageFirebase,faculty, department, createdDate, status) VALUES(?,?,?,?,?,?,?,?,?,?,NOW(),?)";

    db.query(sql, [staffNo, lecturerName, icNumber, lecturerTelephoneNo, lecturerEmail, lecturerPassword, lecturerImage, lecturerImageFirebase, faculty, department, 2], function(err) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            const sqlLecturerInformation = "INSERT INTO lecturer_information(staffNo, floorLvl, roomNo, academicQualification1,academicQualification2,academicQualification3,academicQualification4) VALUES (?,?,?,?,?,?,?)";
            db.query(sqlLecturerInformation, [staffNo, "", "", "", "", "", ""], function(err) {
                if (err) {
                    res.send(JSON.stringify({ success: false, message: err }));
                } else {
                    res.send(JSON.stringify({ success: true, message: "Lecturer Registered" }));
                }
            });
        }
    })
})

//to get lecturerImage link from database to counter the file same name from firebase
router.route('/getimage/:staffNo').get((req, res) => {
    var staffNo = req.params.staffNo;

    const sql = "SELECT lecturerImageFirebase FROM lecturer WHERE staffNo=?";

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

    const sql = "UPDATE lecturer SET lecturerImage = ? WHERE staffNo=?";

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

    const sql = "UPDATE lecturer SET lecturerPassword = ? WHERE lecturerEmail = ?";

    db.query(sql, [lecturerPassword, lecturerEmail], function(error) {
        if (error) {
            res.send(JSON.stringify({ success: false, message: error }));
        } else {
            res.send(JSON.stringify({ success: true, message: "Password Successfully Update" }));
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

//update lecturer_information
router.route('/lecturerinformation/:staffNo').patch((req, res) => {
    var staffNo = req.params.staffNo;
    var floorLvl = req.body.floorLvl;
    var roomNo = req.body.roomNo;
    var academicQualification1 = req.body.academicQualification1;
    var academicQualification2 = req.body.academicQualification2;
    var academicQualification3 = req.body.academicQualification3;
    var academicQualification4 = req.body.academicQualification4;

    var sql = "UPDATE lecturer_information SET floorLvl = ?, roomNo = ?, academicQualification1 = ?,academicQualification2 = ?, academicQualification3 = ?, academicQualification4 = ? WHERE staffNo = ?";

    db.query(sql, [floorLvl, roomNo, academicQualification1, academicQualification2, academicQualification3, academicQualification4, staffNo], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.affectedRows > 0) {
                res.send(JSON.stringify({ success: true, message: "Lecturer Information Successfully Update" }));
            } else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }

        }
    })
});

//get information for lecturer profile
router.route('/lecturerprofile/:staffNo').get((req, res) => {
    var staffNumber = req.params.staffNo;

    const sql = "SELECT l.lecturerImage, lf.* FROM lecturer l, lecturer_information lf WHERE l.staffNo = lf.staffNo AND l.staffNo = ?";

    db.query(sql, [staffNumber], function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                //lecturer: data is VERY IMPORTANT!!
                //IF NOT WE CANNOT PASS TO THE FLUTTER OBJECT 
                //e.g lecturerResponse['lecturer'][0]['staffNo'];
                //MAKRE SURE data is not data[0]
                res.send(JSON.stringify({ success: true, lecturer: data }));
            } else {
                res.send(JSON.stringify({ success: false, message: "Empty Data" }));
            }
        }
    });
});

//get information for booking page in book2
router.route('/book2/:staffNo').get((req, res) => {
    var staffNumber = req.params.staffNo;

    const sql = "SELECT l.*, lf.roomNo, lf.floorLvl FROM lecturer l, lecturer_information lf WHERE l.staffNo = lf.staffNo AND l.staffNo = ?";

    db.query(sql, [staffNumber], function(err, data) {
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

//get count of lecturer in admin
router.route('/totallecturer').get((req, res) => {
    const sql = "SELECT COUNT(*) FROM lecturer";

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

//select lecturer for recent lecturer in admin
router.route('/recentlecturer').get((req, res) => {
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


//delete lecturer account in admin
router.route('/deletelecturer/:staffNo').delete((req, res) => {
    var staffNumber = req.params.staffNo;

    const sql = "DELETE FROM lecturer WHERE staffNo = ?";

    db.query(sql, [staffNumber], function(err) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.send(JSON.stringify({ success: true, message: "Account Successfully Deleted" }));
        }
    });
});

//to display 5 new account registered in dashboard for recent lecturer
router.route('/dashboardlecturer').get((req, res) => {
    const sql = "SELECT * FROM lecturer ORDER BY STR_TO_DATE(createdDate,  '%Y-%m-%d %H:%i:%s') DESC LIMIT 5";

    db.query(sql, function(err,data) {
        if(err){
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



module.exports = router;