//firebase cloud messaging
//import const FCM = require("../services/fcm"); to use

const admin = require("firebase-admin");
const fcm = require("fcm-notification");
const serviceAccount = require("../config/push-notification-key.json");
const certPath = admin.credential.cert(serviceAccount);
const FCM = new fcm(certPath);

module.exports = FCM;