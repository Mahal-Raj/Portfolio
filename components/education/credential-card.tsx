import { Award } from "lucide-react"
import type { Credential } from "@/data/education"

export function CredentialCard({ credential, index }: { credential: Credential; index: number }) {
  return (
    <article className="credential-card">
      <div><span>{String(index + 1).padStart(2, "0")}</span><Award size={20} aria-hidden="true" /></div>
      <p>{credential.issuer}</p>
      <h3>{credential.name}</h3>
      {credential.date ? <time>{credential.date}</time> : null}
      {credential.verificationUrl ? <a href={credential.verificationUrl} target="_blank" rel="noreferrer">{credential.verificationLabel ?? "Verify credential"} ↗</a> : <span className="credential-no-link">No public verification link</span>}
    </article>
  )
}
