// src/config/firebaseAdmin.js
const admin = require("firebase-admin");

let app;

const initFirebaseAdmin = () => {
  if (app) return app; // avoid re-initializing

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("⚠️ Firebase Admin env vars not fully set. Auth verification may fail.");
    return null;
  }

  // Handle escaped newlines in private key if needed
  privateKey = privateKey.replace(/\\n/g, "\n");

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  console.log("✅ Firebase Admin initialized");
  return app;
};

module.exports = {
  initFirebaseAdmin,
  admin,
};
