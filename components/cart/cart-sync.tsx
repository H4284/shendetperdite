"use client";

import { useEffect } from "react";
import { subscribeCartAuth } from "@/lib/cart/sync";

export function CartSync() {
  useEffect(() => subscribeCartAuth(), []);
  return null;
}
