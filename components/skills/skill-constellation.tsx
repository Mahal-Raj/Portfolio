"use client"

import type { CSSProperties } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Cable, Network, Router } from "lucide-react"
import { FaAws } from "react-icons/fa"
import AwsFargate from "aws-react-icons/icons/ArchitectureServiceAWSFargate"
import AwsEcr from "aws-react-icons/icons/ArchitectureServiceAmazonElasticContainerRegistry"
import AwsCloudWatch from "aws-react-icons/icons/ArchitectureServiceAmazonCloudWatch"
import AwsIam from "aws-react-icons/icons/ArchitectureServiceAWSIdentityandAccessManagement"
import {
  SiCisco,
  SiCplusplus,
  SiDocker,
  SiGit,
  SiGithubactions,
  SiGnubash,
  SiOpenjdk,
  SiLinux,
  SiPython,
  SiTerraform,
} from "react-icons/si"
import { skillGroups } from "@/data/skills"
import { cn } from "@/lib/cn"
import { MOTION } from "@/lib/motion"

const positions = [
  [13, 18, 1.16], [33, 12, .9], [55, 18, .88], [76, 12, .84], [89, 29, .82],
  [22, 46, 1.1], [44, 40, 1], [67, 48, .9], [84, 58, .86],
  [10, 71, 1.02], [31, 79, .94], [52, 70, .9], [70, 80, .86], [89, 83, .82],
  [20, 88, .82], [43, 88, .86], [63, 88, .82], [81, 91, .8],
] as const

const skillVisuals = {
  AWS: { icon: FaAws, color: "#ff9900" },
  "ECS Fargate": { icon: AwsFargate, color: "#ed7100", service: true },
  ECR: { icon: AwsEcr, color: "#ed7100", service: true },
  CloudWatch: { icon: AwsCloudWatch, color: "#8c4fff", service: true },
  IAM: { icon: AwsIam, color: "#dd344c", service: true },
  Terraform: { icon: SiTerraform, color: "#7b42bc" },
  "GitHub Actions": { icon: SiGithubactions, color: "#2088ff" },
  Shell: { icon: SiGnubash, color: "#4eaa25" },
  Git: { icon: SiGit, color: "#f05032" },
  Linux: { icon: SiLinux, color: "#e5ae00" },
  Docker: { icon: SiDocker, color: "#2496ed" },
  Python: { icon: SiPython, color: "#3776ab" },
  Java: { icon: SiOpenjdk, color: "#e76f00" },
  "C++": { icon: SiCplusplus, color: "#00599c" },
  Cisco: { icon: SiCisco, color: "#1ba0d7" },
  VLANs: { icon: Network, color: "#0071e3" },
  DHCP: { icon: Cable, color: "#0071e3" },
  Routing: { icon: Router, color: "#0071e3" },
} as const

export function SkillConstellation({ variant = "home" }: { variant?: "home" | "page" }) {
  const reduceMotion = useReducedMotion()
  const skills = skillGroups.flatMap((group) => group.skills.map((skill) => ({ ...skill, category: group.label })))

  return (
    <div className={cn("skill-experience", variant === "page" && "skill-experience-page")}>
      <div className="skill-field" aria-label="Technology logos arranged as an interactive constellation">
        <div className="skill-field-origin" aria-hidden="true"><span>STACK</span></div>
        {skills.map((skill, index) => {
          const [x, y, scale] = positions[index]
          const visual = skillVisuals[skill.name as keyof typeof skillVisuals]
          const Icon = visual.icon
          const style = {
            left: `${x}%`,
            top: `${y}%`,
            "--x": `${x}%`,
            "--y": `${y}%`,
            "--scale": scale,
            "--brand": visual.color,
          } as CSSProperties

          return (
            <motion.div
              key={skill.name}
              className={cn("skill-node", skill.emphasis === "primary" && "is-primary", "service" in visual && visual.service && "is-aws-service")}
              style={style}
              initial={reduceMotion ? false : { x: "-50%", y: "-34%", opacity: 0, scale: .86, filter: "blur(10px)" }}
              whileInView={{ x: "-50%", y: "-50%", opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.32 }}
              transition={{ duration: reduceMotion ? 0 : 1.08, delay: reduceMotion ? 0 : .12 + index * .075, ease: MOTION.ease }}
              aria-label={`${skill.name}. ${skill.category}. ${skill.usedIn}`}
            >
              <motion.div className="skill-logo-circle" whileHover={reduceMotion ? undefined : { y: -5, scale: 1.045 }} transition={{ duration: .42, ease: MOTION.ease }}>
                <Icon aria-hidden="true" />
              </motion.div>
              <strong className="skill-name">{skill.name}</strong>
              <small className="skill-category">{skill.category}</small>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
