import firebase from 'firebase/compat/app';
import "firebase/compat/storage"

const app = firebase.initializeApp({
    apiKey: "AIzaSyCDoNpGD_L2ANccEfyCi5vMGO-5S6D3jDc",
    authDomain: "telegramma-fc27b.firebaseapp.com",
    projectId: "telegramma-fc27b",
    storageBucket: "telegramma-fc27b.appspot.com",
    messagingSenderId: "1075167673525",
    appId: "1:1075167673525:web:c0212d92a9a3d775f152fc"
})

export const storage = app.storage()

export default firebase