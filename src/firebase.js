import firebase from "firebase";
import "firebase/auth"
import conf from './config'

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyD-mtoH4rQiJrE0tNGvLaK2RmMdEaYozTI",
  authDomain: conf.c_authDomain,
  databaseURL: conf.c_databaseURL,
  projectId: 'instagram-clone-0',
  storageBucket: "instagram-clone-0.appspot.com",
  messagingSenderId: conf.c_messagingSenderId,
  appId: conf.c_appId,
  measurementId: conf.c_measurementId
  });

  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();
  export {db, auth, storage};