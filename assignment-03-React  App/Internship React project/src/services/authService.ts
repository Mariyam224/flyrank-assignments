// Firebase Authentication service.
// Wraps the Firebase Auth SDK so the rest of the application only talks to
// this service instead of touching Firebase directly.

import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, type Unsubscribe, type User } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth } from './firebaseService'

/**
 * Maps a Firebase auth error code to a readable message.
 *
 * @param error The caught error (may or may not be a FirebaseError).
 * @returns A message the user can understand.
 */
function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.'
      case 'auth/invalid-email':
        return 'The email address is not valid.'
      case 'auth/weak-password':
        return 'The password is too weak.'
      case 'auth/user-not-found':
        return 'No account found with this email.'
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Incorrect email or password.'
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.'
      case 'auth/network-request-failed':
        return 'Could not reach the server. Check your internet connection.'
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled.'
      default:
        return 'Something went wrong while signing in.'
    }
  }

  return 'Something went wrong while signing in.'
}

/**
 * Registers a new user with the given email and password.
 *
 * @param email The user's email address.
 * @param password The user's password.
 * @returns The newly created Firebase user.
 * @throws If registration fails, with a readable error message.
 */
export async function registerUser(email: string, password: string): Promise<User> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    return credential.user
  } catch (error) {
    console.error('[authService] registerUser failed:', error)
    throw new Error(getAuthErrorMessage(error))
  }
}

/**
 * Signs in an existing user with the given email and password.
 *
 * @param email The user's email address.
 * @param password The user's password.
 * @returns The signed-in Firebase user.
 * @throws If sign-in fails, with a readable error message.
 */
export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return credential.user
  } catch (error) {
    console.error('[authService] loginUser failed:', error)
    throw new Error(getAuthErrorMessage(error))
  }
}

/**
 * Signs out the currently signed-in user.
 *
 * @throws If sign-out fails, with a readable error message.
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('[authService] logoutUser failed:', error)
    throw new Error('Could not sign out. Please try again.')
  }
}

/**
 * Subscribes to authentication state changes.
 * The callback receives the signed-in User, or null when signed out.
 *
 * @param callback Invoked with the current user (or null) whenever the
 * authentication state changes, and once immediately with the current state.
 * @returns An unsubscribe function to stop listening for changes.
 */
export function subscribeToAuthChanges(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback)
}