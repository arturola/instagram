 import firebase from "firebase";
 

 const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBmB6kNrrAn8eAfj4dDg3iwiEiWUEXD6Hg",
    authDomain: "instagram-clo-3d9f1.firebaseapp.com",
    databaseURL: "https://instagram-clo-3d9f1.firebaseio.com",
    projectId: "instagram-clo-3d9f1",
    storageBucket: "instagram-clo-3d9f1.appspot.com",
    messagingSenderId: "854235021468",
    appId: "1:854235021468:web:797a1898762494a2392d59",
    measurementId: "G-R21HFGRBXR"
 })

     const db = firebaseApp.firestore();
     const auth = firebase.auth(); // Enables to create users
     const storage = firebase.storage(); // Enables to upload 

export { db, auth, storage }; 