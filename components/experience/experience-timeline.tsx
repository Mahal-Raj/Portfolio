import Image from "next/image"
import { experienceGroups } from "@/data/experience"

function Highlight({ text }: { text: string }) {
  return <>{text.split(/(\b\d+(?:[.,]\d+)*(?:\+|%)?)/g).map((part, index) => /^\d/.test(part) ? <strong key={index}>{part}</strong> : part)}</>
}

export function ExperienceTimeline({ asOf }: { asOf: number }) {
  return (
    <div className="p-experience-groups">
      {experienceGroups.map((group) => (
        <article key={group.id} className="p-company-card" id={group.id} aria-labelledby={`${group.id}-heading`}>
          <header className="p-company-heading">
            <div>
              <h2 id={`${group.id}-heading`}>{group.company}</h2>
              <p className="p-company-count">{group.roles.length} {group.roles.length === 1 ? "role" : "roles"}</p>
            </div>
            <div className="p-company-logo">
              <Image src={group.logo} alt={`${group.company} logo`} width={80} height={56} />
            </div>
          </header>
          <ol className="p-company-timeline" aria-label={`${group.company} positions`}>
            {group.roles.map((role) => (
              <li key={role.role} className="p-timeline-role">
                <div className="p-role-meta">
                  <p>{role.period.replace(" - ", " — ")}</p>
                  {role.location ? <span>{role.location}</span> : null}
                  {role.employment !== role.role ? <small>{role.employment}</small> : null}
                </div>
                <div className="p-role-main">
                  <div className="p-role-title">
                    <h3>{role.role}</h3>
                  </div>
                  {role.team ? <p className="p-role-team">{role.team}</p> : null}
                  {role.plannedUntil && asOf < Date.parse(role.plannedUntil) ? <p className="p-role-team">Planned responsibilities</p> : null}
                  <ul>{role.highlights.map((highlight) => <li key={highlight}><Highlight text={highlight} /></li>)}</ul>
                  {role.skills.length ? <p className="p-role-skills"><span>{role.skillsLabel ?? "Skills"}</span>{role.skills.join(" · ")}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </article>
      ))}
    </div>
  )
}
