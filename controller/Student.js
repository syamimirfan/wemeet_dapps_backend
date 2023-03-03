const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.route('/view').get((req, res) => {
    const sql = 'SELECT * FROM student ';
    db.query(sql, (err, data) => {
        if (err) {
            res.error(err.sqlMessage, res);
        } else {
            res.status(200).json({
                success: true,
                student: data
            });
        }
    })
})

//student login backend
router.route('/studentlogin').post((req, res) => {

    var studEmail = req.body.studEmail;
    var studPassword = req.body.studPassword;

    var sql = "SELECT * FROM student WHERE studEmail=? AND studPassword=?";

    if (studEmail != "" && studPassword != "") {
        db.query(sql, [studEmail, studPassword], function(err, data) {
            if (err) {
                res.send(JSON.stringify({ success: false, message: err }));

            } else {
                if (data.length > 0) {
                    res.send(JSON.stringify({ success: true, student: data, status: data[0]['status'] }));
                } else {
                    res.send(JSON.stringify({ success: false, message: 'Empty Data' }));
                }
            }
        });
    } else {
        res.send(JSON.stringify({ success: false, message: 'Email and password required!' }));
    }

});

router.route('/getstudent/:matricNo').get((req, res) => {
    var matricNumber = req.params.matricNo;
    const sql = "SELECT * FROM student WHERE matricNo = ?";

    db.query(sql, matricNumber, function(err, data) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if (data.length > 0) {
                res.send(JSON.stringify({ success: true, student: data }));
            } else {
                res.send(JSON.stringify({ success: false, message: "User Not Found" }));
            }

        }
    });
})

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

    //create query
    var sqlQuery = "INSERT INTO student( matricNo, icNumber, tokenAddress, studName, studTelephoneNo, studEmail, studPassword, studImage, faculty, program, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

    //call database to insert so add or include database
    db.query(sqlQuery, [matricNo, icNumber, "", studName, studTelephoneNo, studEmail, studPassword, studImage, faculty, program, 1], function(error) {
        if (error) {
            // if error send response here
            res.send(JSON.stringify({ success: false, message: error }));
        } else {
            // if success send response here
            res.send(JSON.stringify({ success: true, message: 'Student Registered' }));
        }
    });

});

//reset password backend
router.route('/resetpassword').post((req, res) => {
    var studEmail = req.body.studEmail;
    var studPassword = req.body.studPassword;

    var sql = "UPDATE student SET studPassword = ? WHERE studEmail = ?";

    db.query(sql, [studPassword, studEmail], function(error) {
        if (error) {
            res.send(JSON.stringify({ success: false, message: error }));
        } else {
            res.send(JSON.stringify({ success: true, message: "Password Successfully Update" }));
        }
    });
});

//delete student account 
router.route('/deletestudent/:matricNo').delete((req, res) => {
    var matricNo = req.params.matricNo;

    var sql = "DELETE * FROM student WHERE matricNo=?";

    db.query(sql, [matricNo], function(err) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.send(JSON.stringify({ success: true, message: "Account Successfully Deleted" }));
        }
    });
});

module.exports = router;