import admin from 'firebase-admin';
import dotenv from 'dotenv'
dotenv.config()
//firebase configuration
const firebaseConfig = {
  "type": "service_account",
  "project_id": process.env.FB_PROJECTID,
  "private_key_id": process.env.FB_PRIVATEKEYID,
  "private_key": process.env.FB_PRIVATEKEY,
  "client_email": process.env.FB_CLIENT_EMAIL,
  "client_id": process.env.FB_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.FB_CLIENT_CERT_URL,
  "universe_domain": "googleapis.com"
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

export default admin;