import { BaseCard } from "./base-card";
import { PositionCard } from "./position-card";
import { Experience } from "@/constants/experiences";

interface ExperienceCardProps {
  readonly experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <BaseCard>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-primary">{experience.company}</h3>
      </div>
      
      <div className="space-y-4">
        {experience.positions.map((position, index) => (
          <PositionCard 
            key={position.id} 
            position={position} 
            index={index}
          />
        ))}
      </div>
    </BaseCard>
  );
}
