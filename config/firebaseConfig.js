const { initializeApp, cert } = require("firebase-admin/app");
const admin = require("firebase-admin");

const serviceAccount = require("../../ecoscan-2e463-firebase-adminsdk-rgirn-8fa34bbd32.json"); // Path to your Firebase service account key

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Firebase Storage bucket URL
});

const bucket = admin.storage().bucket();

// Upload function
const fileUpload = (file, filename) => {
  bucket.file(filename).createWriteStream().end(file.buffer); // Upload the file
  const file_url = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/${filename}?alt=media`;
  return file_url; // Return the file URL after uploading
};

module.exports = { fileUpload };
