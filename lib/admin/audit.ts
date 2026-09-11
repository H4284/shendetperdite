import { getAdminDb } from "@/lib/firebase/admin";
import type { AuthUser } from "@/lib/auth/admin";

export async function writeAuditLog(input: {
  actor: AuthUser;
  action: string;
  entity: string;
  entityId: string;
  meta?: Record<string, unknown>;
}) {
  await getAdminDb().collection("auditLogs").add({
    actorUid: input.actor.uid,
    actorEmail: input.actor.email ?? "",
    action: input.action,
    entity: input.entity,
    entityId: input.entityId,
    meta: input.meta ?? {},
    at: new Date(),
  });
}
