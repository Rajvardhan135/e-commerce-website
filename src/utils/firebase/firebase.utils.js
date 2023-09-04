import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, doc } from 'firebase/firestore';

import {
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBm2dgY4ea8OVAHx5Zto4mpcJxo0tLEFjc",
    authDomain: "kings-shopping-98b53.firebaseapp.com",
    projectId: "kings-shopping-98b53",
    storageBucket: "kings-shopping-98b53.appspot.com",
    messagingSenderId: "825388554451",
    appId: "1:825388554451:web:36cdfaac07bd18472edc26"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account',
});

export const auth = getAuth();

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, provider);

export const createAuthWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password);
}

export const signInAuthWithEmailAndPassword = async (email, password) => {
    if (email && password) return await signInWithEmailAndPassword(auth, email, password);
    return;
}

export const signOutUser = async () => signOut(auth);

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback)

export const getCategoryData = async(category) => {
    const docRef = doc(db, 'category', category)
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
        return docSnap.data();
    }else {
        return null
    }
}

