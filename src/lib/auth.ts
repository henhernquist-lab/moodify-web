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
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);
const googleProvider = new GoogleAuthProvider();

export async function signUpWithEmail(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    await setDoc(doc(db, "users", userCredential.user.uid), {
        displayName: displayName,
        email: email,
        onboardingComplete: false,
    });
    return userCredential;
}

export function signInWithEmail(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
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
    return firebaseSignOut(auth);
}

export function getCurrentUser() {
    return auth.currentUser;
}

export function onAuthStateChanged(callback) {
    return firebaseOnAuthStateChanged(auth, callback);
}

export function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
}

export async function checkOnboardingStatus(userId) {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
        return userDoc.data().onboardingComplete || false;
    }
    return false;
}

export async function completeOnboarding(userId, data) {
    await setDoc(doc(db, "users", userId), data, { merge: true });
    return await setDoc(doc(db, "users", userId), { onboardingComplete: true }, { merge: true });
}

export async function saveOnboardingData(userId, data) {
    return setDoc(doc(db, "users", userId), data, { merge: true });
}
