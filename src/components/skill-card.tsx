import { BaseCard } from "./base-card";
import { TechStackTags } from "./tech-stack-tags";
import { Skills } from "@/constants/experiences";

interface SkillCardProps {
  title: string;
  skills: Skills;
}

export function SkillCard({ title, skills: skillItems }: SkillCardProps) {

  return (
    <BaseCard padding="sm">
      <h3 className="font-medium text-lg mb-3">{title}</h3>
      <TechStackTags technologies={skillItems.map(skill => skill.name)} />
    </BaseCard>
  );
}
