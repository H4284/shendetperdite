"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseClient } from "@/lib/firebase/client";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { auth } = getFirebaseClient();
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setReady(true);
      if (!next) {
        setIsAdmin(false);
        return;
      }
      void next.getIdTokenResult().then((token) => {
        setIsAdmin(token.claims.admin === true || token.claims.role === "admin");
      });
    });
  }, []);

  return { user, ready, isAdmin };
}
