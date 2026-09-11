"use client";

import {
  GoogleAuthProvider,
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseClient } from "@/lib/firebase/client";

async function postSession(user: User) {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!response.ok) {
    const error = new Error("session_failed") as Error & { code: string };
    error.code = "session_failed";
    throw error;
  }
}

export async function createSession(user: User) {
  await postSession(user);
}

export async function clearSession() {
  await fetch("/api/auth/session", { method: "DELETE" });
}

export async function loginWithEmail(email: string, password: string) {
  const { auth } = getFirebaseClient();
  const result = await signInWithEmailAndPassword(auth, email.trim(), password);
  await postSession(result.user);
  return result.user;
}

export async function registerWithEmail(input: {
  email: string;
  password: string;
  displayName: string;
}) {
  const { auth } = getFirebaseClient();
  const result = await createUserWithEmailAndPassword(
    auth,
    input.email.trim(),
    input.password,
  );
  if (input.displayName) {
    await updateProfile(result.user, { displayName: input.displayName });
  }
  try {
    await sendEmailVerification(result.user, {
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,
    });
  } catch (error) {
    console.warn("Verification email was not sent", error);
  }
  await postSession(result.user);
  return result.user;
}

export async function loginWithGoogle() {
  const { auth } = getFirebaseClient();
  const result = await signInWithPopup(auth, new GoogleAuthProvider());
  await postSession(result.user);
  return result.user;
}

export async function sendResetEmail(email: string) {
  const { auth } = getFirebaseClient();
  await sendPasswordResetEmail(auth, email.trim(), {
    url: `${window.location.origin}/reset-password`,
    handleCodeInApp: true,
  });
}

export async function completePasswordReset(oobCode: string, password: string) {
  const { auth } = getFirebaseClient();
  await confirmPasswordReset(auth, oobCode, password);
}

export async function completeEmailVerification(oobCode: string) {
  const { auth } = getFirebaseClient();
  await applyActionCode(auth, oobCode);
}

export async function logout() {
  const { auth } = getFirebaseClient();
  await signOut(auth);
  await clearSession();
}
