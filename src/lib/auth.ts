import firebase_app from './firebase';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail
} from "firebase/auth";
import type { NextOrObserver, User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

type OnboardingData = Record<string, unknown>;

function getFirebaseAuth() {
    return getAuth(firebase_app);
}

function getFirebaseDb() {
    return getFirestore(firebase_app);
}

function getGoogleProvider() {
    return new GoogleAuthProvider();
}

export async function signUpWithEmail(email: string, password: string, displayName: string) {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    await setDoc(doc(db, "users", userCredential.user.uid), {
        displayName: displayName,
        email: email,
        onboardingComplete: false,
    });
    return userCredential;
}

export function signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function signInWithGoogle() {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    const result = await signInWithPopup(auth, getGoogleProvider());
    const user = result.user;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            onboardingComplete: false,
        });
    }
    return result;
}

export function signOut() {
    return firebaseSignOut(getFirebaseAuth());
}

export function getCurrentUser() {
    return getFirebaseAuth().currentUser;
}

export function onAuthStateChanged(callback: NextOrObserver<User>) {
    return firebaseOnAuthStateChanged(getFirebaseAuth(), callback);
}

export function resetPassword(email: string) {
    return sendPasswordResetEmail(getFirebaseAuth(), email);
}

export async function checkOnboardingStatus(userId: string) {
    const db = getFirebaseDb();
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
        return userDoc.data().onboardingComplete || false;
    }
    return false;
}

export async function completeOnboarding(userId: string, data: OnboardingData = {}) {
    const db = getFirebaseDb();
    await setDoc(doc(db, "users", userId), data, { merge: true });
    return await setDoc(doc(db, "users", userId), { onboardingComplete: true }, { merge: true });
}

export async function saveOnboardingData(userId: string, data: OnboardingData) {
    return setDoc(doc(getFirebaseDb(), "users", userId), data, { merge: true });
}
