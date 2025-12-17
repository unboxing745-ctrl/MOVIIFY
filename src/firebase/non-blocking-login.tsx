
'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  FirebaseError,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';

type ToastFunction = (options: {
  variant?: 'default' | 'destructive';
  title: string;
  description: string;
}) => void;

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(
  authInstance: Auth,
  email: string,
  password: string,
  toast: ToastFunction
): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password).catch(
    (error: FirebaseError) => {
      let title = 'Sign-up failed';
      let description = 'An unexpected error occurred.';
      if (error.code === 'auth/email-already-in-use') {
        title = 'Email in use';
        description =
          'This email is already associated with an account. Please log in.';
      } else if (error.code === 'auth/weak-password') {
        title = 'Weak Password';
        description = 'The password must be at least 6 characters long.';
      }
      toast({ variant: 'destructive', title, description });
    }
  );
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(
  authInstance: Auth,
  email: string,
  password: string,
  toast: ToastFunction
): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password).catch(
    (error: FirebaseError) => {
      let title = 'Login failed';
      let description = 'An unexpected error occurred.';
      if (error.code === 'auth/invalid-credential') {
        title = 'Invalid Credentials';
        description = 'The email or password you entered is incorrect.';
      }
      toast({ variant: 'destructive', title, description });
    }
  );
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}
