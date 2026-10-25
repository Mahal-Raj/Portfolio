import Image from "next/image"
import { PageHero } from "@/components/ui/page-hero"
import { credentials, education, schoolEducation } from "@/data/education"
import { pageMetadata } from "@/lib/metadata"
import "./education.css"
export const metadata = pageMetadata("Education", "Computer Science at Algoma University, a CA$20,000 Chancellor’s Award, and science studies at Indian Heritage Public School in Dhariwal, Punjab.", "/education")
const coursework = ["Computer Networks", "Operating Systems", "Data Structures & Algorithms", "Object-Oriented Design", "Software Development", "Artificial Intelligence", "Database Systems", "Python & Java"]
export default function EducationPage() {
  return <>
    <PageHero eyebrow="Education" title="The foundation." description="Computer Science, practical coursework and continued learning." />
    <section className="p-shell p-education-list" aria-label="Academic background">
      <article className="p-degree" aria-labelledby="algoma-degree">
        <div>
          <p className="p-eyebrow">{education.institution}</p>
          <h2 id="algoma-degree">{education.degree}</h2>
          <p>Brampton, Ontario · {education.period}</p>
          <dl className="p-academic-highlights">
            <div><dt>Cumulative GPA</dt><dd>{education.gpa}</dd></div>
            <div><dt>{education.award.name}</dt><dd>{education.award.amount}<span>{education.award.duration}</span></dd></div>
          </dl>
        </div>
        <figure><Image src="/images/algoma-university-brampton.jpg" alt="Algoma University Brampton campus" fill sizes="(max-width: 760px) 100vw, 45vw" /></figure>
      </article>
      <article className="p-degree p-school" aria-labelledby="school-education">
        <div>
          <p className="p-eyebrow">{schoolEducation.qualification}</p>
          <h2 id="school-education">{schoolEducation.institution}</h2>
          <p>{schoolEducation.location}</p>
          <p className="p-school-subjects">{schoolEducation.subjects.join(" · ")}</p>
          <dl className="p-academic-highlights">
            <div><dt>Perfect GPA</dt><dd>{schoolEducation.gpa}</dd></div>
          </dl>
        </div>
        <figure className="p-school-gallery">
          <div className="p-school-image-frame">
            <Image className="p-school-campus" src={schoolEducation.image} alt="Indian Heritage Public School campus in Dhariwal, Punjab" width={1198} height={624} sizes="(max-width: 760px) 55vw, 28vw" />
            <a className="p-clipping-preview" href={schoolEducation.clipping} target="_blank" rel="noreferrer" aria-label="Open the full newspaper clipping">
              <Image src={schoolEducation.clipping} alt="Newspaper clipping reporting Sukhraj Singh's first place at Indian Heritage Public School with 93.4% in Class XII, 2021–22" width={950} height={1656} sizes="(max-width: 760px) 32vw, 180px" />
            </a>
          </div>
          <figcaption>
            <a href={schoolEducation.imageSource} target="_blank" rel="noreferrer">Campus photo credit ↗</a>
            <a href={schoolEducation.clipping} target="_blank" rel="noreferrer">View full clipping ↗</a>
          </figcaption>
        </figure>
      </article>
    </section>
    <section className="p-shell p-section p-coursework"><h2>Relevant coursework.</h2><ul>{coursework.map((course) => <li key={course}>{course}</li>)}</ul></section>
    <section className="p-section p-soft"><div className="p-shell"><div className="p-section-head"><h2>Selected credentials.</h2></div><div className="p-credentials">{credentials.map((credential) => <article key={credential.name}><div><p className="p-eyebrow">{credential.issuer}</p><h3>{credential.name}</h3><p>{credential.date}</p></div>{credential.verificationUrl ? <a className="p-text-link" href={credential.verificationUrl} target="_blank" rel="noreferrer">View record ↗</a> : <span className="p-small-note">Details on request</span>}</article>)}</div><p className="p-small-note">Oracle records open on Oracle&apos;s verification service; availability may vary.</p></div></section>
  </>
}
