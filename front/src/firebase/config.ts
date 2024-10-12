import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
	appId: import.meta.env.VITE_FIREBASE_APPID
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
auth.languageCode = "es"

const db = getFirestore(app)

export { app, auth, db }
