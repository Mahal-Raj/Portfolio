export function ProjectArchitecture({ steps }: { steps: string[] }) {
  return (
    <div className="case-architecture" aria-label={`Architecture: ${steps.join(" to ")}`}>
      {steps.map((step, index) => (
        <div key={step}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{step}</strong>
          {index < steps.length - 1 ? <i aria-hidden="true" /> : null}
        </div>
      ))}
    </div>
  )
}
