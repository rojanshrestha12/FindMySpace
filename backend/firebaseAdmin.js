import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json'; // Path to your service account key

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;

