const express = require('express');
const router = express.Router();
const db = require('../config/db');

//student sending a message
router.route('/studentmessage').post((req,res) => {
    var matricNo = req.body.matricNo;
    var staffNo  = req.body.staffNo;
    var messageText = req.body.messageText;
    
    const sql = "INSERT INTO chat(matricNo, staffNo, messageText, sendTextTime, statusMessage) VALUES (?,?,?,NOW(),1)";

    db.query(sql,[matricNo,staffNo,messageText], function(err) {
        if(err) {
            res.send(JSON.stringify({ success: false, message: err }));
        }else {
            res.send(JSON.stringify({ success: true, message: "Student Send Message!" }));
        }
    })
});

//lecturer sending a message
router.route('/lecturermessage').post((req,res) => {
    var matricNo = req.body.matricNo;
    var staffNo  = req.body.staffNo;
    var messageText = req.body.messageText;
    
    const sql = "INSERT INTO chat(matricNo, staffNo, messageText, sendTextTime, statusMessage) VALUES (?,?,?,NOW(),2)";

    db.query(sql,[matricNo,staffNo,messageText], function(err) {
        if(err) {
            res.send(JSON.stringify({ success: false, message: err }));
        }else {
            res.send(JSON.stringify({ success: true, message: "Lecturer Send Message!" }));
        }
    })
});

//get contact lecturer button
router.route('/contactlecturer/:staffNo').get((req, res) => {
    var staffNo = req.params.staffNo;

    const sql = "SELECT * from lecturer WHERE staffNo = ?";

    db.query(sql,[staffNo] , function (err,data) {
        if(err) {
          res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if(data.length > 0) {
                res.send(JSON.stringify({ success: true, chat: data }));
            }else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//get contact student button
router.route('/contactstudent/:matricNo').get((req, res) => {
    var matricNo = req.params.matricNo;

    const sql = "SELECT * from student WHERE matricNo = ?";

    db.query(sql,[matricNo] , function (err,data) {
        if(err) {
          res.send(JSON.stringify({ success: false, message: err }));
        } else {
            if(data.length > 0) {
                res.send(JSON.stringify({ success: true, chat: data }));
            }else {
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//get message
router.route('/getmessage/:matricNo/:staffNo').get((req,res) => {
    var matricNo = req.params.matricNo;
    var staffNo = req.params.staffNo;

    const sql = "SELECT * FROM chat WHERE matricNo = ? AND staffNo = ?";

    db.query(sql, [matricNo, staffNo], function(err, data) {
        if(err){
            res.send(JSON.stringify({ success: false, message: err }));
        }else{
            if(data.length > 0){
                res.send(JSON.stringify({ success: true, chat: data }));
            }else{
                res.send(JSON.stringify({ success: true, message: "Empty Data" }));
            }
        }
    });
});

//delete chat
router.route('/deletechat/:chatId').delete((req, res) => {
    var chatId = req.params.chatId;

    const sql = "DELETE FROM chat WHERE chatId = ?";

    db.query(sql, [chatId], function(err) {
        if (err) {
            res.send(JSON.stringify({ success: false, message: err }));
        } else {
            res.send(JSON.stringify({ success: true, message: "Chat Successfully Deleted" }));
        }
    });
});

module.exports = router;