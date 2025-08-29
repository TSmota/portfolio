import { useTranslations } from "next-intl";
import { BaseCard } from "./base-card";
import { Education } from "@/constants/experiences";
import { StatusBadge } from "./status-badge";

interface EducationCardProps {
  education: Education; 
}

export function EducationCard({ 
  education, 
}: EducationCardProps) {
  const t = useTranslations("home.education");

  const isCompleted = education.status === 'completed';
  
  return (
    <BaseCard>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-primary">
            {t(`${education.id}.institution`)}
          </h3>
          <p className="font-medium">{t(`${education.id}.degree`)}</p>
        </div>
        <span className={`text-sm mt-2 sm:mt-0 px-3 py-1 rounded-full ${
          isCompleted 
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
            : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
        }`}>
          {t(`${education.id}.period`)}
        </span>
      </div>
      
      <StatusBadge status={education.status} />
    </BaseCard>
  );
}
