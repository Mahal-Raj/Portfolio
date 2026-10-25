export interface Credential {
  name: string
  issuer: string
  date: string
  credentialId: string
  verificationUrl: string
  verificationLabel?: string
}

export const education = {
  degree: "Bachelor of Computer Science",
  institution: "Algoma University",
  period: "Expected December 2027",
  gpa: "3.9 / 4.0",
  award: {
    name: "Chancellor’s Award",
    amount: "CA$20,000",
    duration: "Over four years of my degree",
  },
}

export const schoolEducation = {
  institution: "Indian Heritage Public School",
  qualification: "Senior secondary education",
  location: "Dhariwal, Punjab, India",
  subjects: ["Mathematics", "Physics", "Chemistry"],
  gpa: "4.0 / 4.0",
  image: "/images/indian-heritage-public-school-dhariwal.jpg",
  imageSource: "http://ihpsdhariwal.in/",
  clipping: "/images/sukhraj-school-newspaper-pic3.png",
}

export const credentials: Credential[] = [
  {
    name: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    issuer: "Oracle",
    date: "Issued 2025",
    credentialId: "",
    verificationUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=975B31F15F131340304D3D5585C53D09D7E767CCBAF9123FE835BF1326D37CE7",
    verificationLabel: "Open Oracle share record",
  },
  {
    name: "Oracle Cloud Infrastructure 2025 Certified Foundations Associate",
    issuer: "Oracle",
    date: "Issued 2025",
    credentialId: "",
    verificationUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=1D170CD159CC056389F735775401E4D92268057B4A0EA645F209BCD298D424D9",
    verificationLabel: "Open Oracle share record",
  },
  {
    name: "Oracle Cloud Infrastructure DevOps Professional",
    issuer: "Oracle",
    date: "Issued 2025",
    credentialId: "",
    verificationUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=CB6124C361BAD87FC9099F94AEF2D2FD23EB185706F05E4DA06101B04ACC8726",
    verificationLabel: "Open Oracle share record",
  },
]
