// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyDpwL0OSCzziygmXgT59eBQLnUnyLthUog',
    authDomain: 'todo-app-73d98.firebaseapp.com',
    projectId: 'todo-app-73d98',
    storageBucket: 'todo-app-73d98.firebasestorage.app',
    messagingSenderId: '245655702828',
    appId: '1:245655702828:web:fddfe81a16dba31881f089',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
