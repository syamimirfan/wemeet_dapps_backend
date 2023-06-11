//firebase cloud messaging
//import const FCM = require("../services/fcm"); to use
require("dotenv").config();
const push_notification_key = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id:  process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key:  process.env.FIREBASE_PRIVATE_KEY,
    client_email:  process.env.FIREBASE_CLIENT_EMAIL,
    client_id:  process.env.FIREBASE_CLIENT_ID,
    auth_uri:  process.env.FIREBASE_AUTH_URI,
    token_uri:  process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:  process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url:  process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
  }
  

const admin = require("firebase-admin");
const fcm = require("fcm-notification");
const serviceAccount = JSON.stringify(push_notification_key);
const certPath = admin.credential.cert(serviceAccount);
const FCM = new fcm(certPath);

module.exports = FCM;