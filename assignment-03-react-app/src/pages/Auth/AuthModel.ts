import { loginUser, logoutUser, registerUser } from '../../services/authService'
import type { User } from 'firebase/auth'

export interface AuthModel {
  // Auth-specific data and business logic live here.
}

/**
 * Normalizes an email address by trimming surrounding whitespace and
 * converting it to lowercase, so lookups are consistent.
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Validates the credentials before calling the auth service.
 *
 * - The email and password must not be empty
 * - The password must be at least six characters long
 *
 * @throws If any validation fails.
 */
function validateCredentials(email: string, password: string): void {
  if (!email) {
    throw new Error('Email is required.')
  }

  if (!password) {
    throw new Error('Password is required.')
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.')
  }
}

/**
 * Registers a new user with the given email and password.
 *
 * @param email The user's email address.
 * @param password The user's password.
 * @returns The authenticated Firebase user.
 * @throws If the credentials are invalid or registration fails.
 */
export async function register(email: string, password: string): Promise<User> {
  const normalizedEmail = normalizeEmail(email)
  validateCredentials(normalizedEmail, password)

  return registerUser(normalizedEmail, password)
}

/**
 * Signs in an existing user with the given email and password.
 *
 * @param email The user's email address.
 * @param password The user's password.
 * @returns The authenticated Firebase user.
 * @throws If the credentials are invalid or sign-in fails.
 */
export async function login(email: string, password: string): Promise<User> {
  const normalizedEmail = normalizeEmail(email)
  validateCredentials(normalizedEmail, password)

  return loginUser(normalizedEmail, password)
}

/**
 * Signs out the currently signed-in user.
 *
 * @throws If sign-out fails.
 */
export async function logout(): Promise<void> {
  return logoutUser()
}