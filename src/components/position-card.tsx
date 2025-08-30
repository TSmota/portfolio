"use client";

import { useTranslations } from "next-intl";
import { TechStackTags } from "./tech-stack-tags";
import { Position } from "@/constants/experiences";

interface PositionCardProps {
  position: Position;
  index: number;
}

export function PositionCard({ position, index }: PositionCardProps) {
  const t = useTranslations("home");

  return (
    <div className={`${index > 0 ? 'border-t pt-4' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
        <div>
          <h4 className="text-lg font-semibold">
            {t(`experience.positions.${position.id}.title`)}
          </h4>
        </div>
        <span className="text-sm text-muted-foreground mt-2 sm:mt-0 bg-secondary px-3 py-1 rounded-full">
          {t(`experience.positions.${position.id}.period`)}
        </span>
      </div>
      <div className="text-muted-foreground mb-3 leading-relaxed">
        {t.rich(`experience.positions.${position.id}.description`, {
          ul: (chunks) => <ul className="list-disc list-inside mt-2 space-y-1">{chunks}</ul>,
          li: (chunks) => <li className="text-sm">{chunks}</li>
        })}
      </div>
      <TechStackTags technologies={position.technologies} size="sm" />
    </div>
  );
}
