"use client";

/** Light obfuscation so scrapers don't get a plain mailto in HTML (Cloudflare can add more). */
export function ObfuscatedEmail({ email }: { email: string }) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return <span>{email}</span>;
  return (
    <a
      href={`mailto:${email}`}
      className="hover:text-foreground"
      onClick={(event) => {
        event.preventDefault();
        window.location.href = `mailto:${user}@${domain}`;
      }}
    >
      <span>{user}</span>
      <span aria-hidden="true">&#64;</span>
      <span className="hidden">[at]</span>
      <span>{domain}</span>
    </a>
  );
}
