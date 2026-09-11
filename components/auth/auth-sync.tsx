"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseClient } from "@/lib/firebase/client";
import { clearSession, createSession } from "@/lib/auth/client";

export function AuthSync() {
  useEffect(() => {
    const { auth } = getFirebaseClient();
    return onAuthStateChanged(auth, async (user) => {
      try {
        if (user) await createSession(user);
        else await clearSession();
      } catch {
        // Session cookie can be retried on the next navigation.
      }
    });
  }, []);

  return null;
}
