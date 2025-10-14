import { initializeApp } from "firebase/app";
import {
    getFirestore,
    getDoc,
    setDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";

import {
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBm2dgY4ea8OVAHx5Zto4mpcJxo0tLEFjc",
    authDomain: "kings-shopping-98b53.firebaseapp.com",
    projectId: "kings-shopping-98b53",
    storageBucket: "kings-shopping-98b53.appspot.com",
    messagingSenderId: "825388554451",
    appId: "1:825388554451:web:36cdfaac07bd18472edc26"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// --- Google Provider ---
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: "select_account",
});

// --- Save or Update User in Firestore ---
const saveUserToFirestore = async (userAuth) => {
    if (!userAuth) return;

    const userRef = doc(db, "users", userAuth.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            displayName: userAuth.displayName || "",
            email: userAuth.email,
            photoURL: userAuth.photoURL || "",
            blocked: false, // new users are not blocked
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
        });
    } else {
        await setDoc(
            userRef,
            { lastLogin: serverTimestamp() },
            { merge: true }
        );
    }
};

// --- Check if user is blocked ---
const checkIfBlocked = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists() && userSnap.data().blocked) {
        await signOut(auth); // immediately sign out
        throw new Error("Your account has been blocked. Please contact support.");
    }
};

// --- Sign In / Sign Up Methods ---
export const signInWithGooglePopup = async () => {
    const result = await signInWithPopup(auth, provider);
    await checkIfBlocked(result.user.uid);
    await saveUserToFirestore(result.user);
    return result;
};

export const signInWithGoogleRedirect = async () => {
    const result = await signInWithRedirect(auth, provider);
    await checkIfBlocked(result.user.uid);
    await saveUserToFirestore(result.user);
    return result;
};

export const createAuthWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserToFirestore(result.user);
    return result;
};

export const signInAuthWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;
    const result = await signInWithEmailAndPassword(auth, email, password);
    await checkIfBlocked(result.user.uid);
    await saveUserToFirestore(result.user);
    return result;
};

// --- Auth State Listener ---
export const onAuthStateChangedListener = (callback) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                await checkIfBlocked(user.uid);
                callback(user);
            } catch (err) {
                console.warn("Blocked user tried to log in.");

                callback(null);
            }
        } else {
            callback(null);
        }
    });
};
// --- Sign Out ---
export const signOutUser = async () => signOut(auth);
// --- Example Data Fetch ---
export const getCategoryData = async (category) => {
    const docRef = doc(db, "category", category);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
};
export default app;