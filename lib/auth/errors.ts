export function authErrorMessage(code: string | undefined) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Email-i ose fjalëkalimi nuk është i saktë.";
    case "auth/email-already-in-use":
      return "Ky email është i regjistruar tashmë.";
    case "auth/weak-password":
      return "Fjalëkalimi duhet të ketë të paktën 8 karaktere.";
    case "auth/too-many-requests":
      return "Shumë tentativa. Provoni përsëri pas pak.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "";
    case "auth/account-exists-with-different-credential":
      return "Ky email është përdorur me një metodë tjetër hyrjeje.";
    case "auth/network-request-failed":
      return "Nuk ka lidhje me internetin. Provoni përsëri.";
    case "auth/requires-recent-login":
      return "Për siguri, hyni përsëri dhe ndryshoni fjalëkalimin.";
    case "auth/expired-action-code":
    case "auth/invalid-action-code":
      return "Lidhja ka skaduar ose nuk është e vlefshme.";
    case "auth/unauthorized-domain":
      return "Ky domain nuk është i lejuar. Shtojeni te Firebase Console → Authentication → Settings → Authorized domains.";
    case "auth/operation-not-allowed":
      return "Kjo metodë hyrjeje nuk është aktive në Firebase.";
    case "auth/invalid-api-key":
    case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
    case "auth/configuration-not-found":
      return "Konfigurimi i Firebase nuk përputhet me projektin e vërtetë.";
    case "session_failed":
      return "Hyrja u bë, por sesioni nuk u ruajt. Provoni përsëri.";
    default:
      return "Nuk mundëm të përfundojmë këtë veprim. Provoni përsëri.";
  }
}

export function firebaseErrorCode(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    return String((error as { code: unknown }).code);
  }
  return undefined;
}
