import { getTranslations } from "next-intl/server";
import { skills, experiences, educations } from "@/constants/experiences";
import { FileCommentHeader } from "@/components/file-comment-header";
import { SectionHeader } from "@/components/section-header";
import { SkillCard } from "@/components/skill-card";
import { ExperienceCard } from "@/components/experience-card";
import { EducationCard } from "@/components/education-card";

const startDate = new Date("2018-10-01").getTime();
const currentDate = new Date().getTime();
const years = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 365));

export default async function Home() {
  const t = await getTranslations("home");

  return (
    <main className="h-full bg-background text-foreground overflow-auto">
      <div className="flex-1 p-4 sm:p-6">
        <FileCommentHeader filename="about.tsx" />

        {/* Personal Info Section */}
        <div className="mb-6 sm:mb-8">
          <p>{t('introduction')}</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Thiago Mota</h1>
          <p className="text-lg sm:text-xl text-primary mb-3">{t('jobTitle')}</p>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{t('description', { years })}</p>
        </div>

        {/* Skills Section */}
        <div id="skills" className="mb-6 sm:mb-8 scroll-mt-4">
          <SectionHeader icon="💻" title={t('skills.title')} />
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
            {Object.entries(skills).map(([key, value]) => (
              <SkillCard
                key={key}
                title={t(`skills.${key as keyof typeof skills}`)}
                skills={value}
              />
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div id="experience" className="mb-6 sm:mb-8 scroll-mt-4">
          <SectionHeader icon="💼" title={t('experience.title')} />
          <div className="space-y-6">
            {(Object.keys(experiences) as Array<keyof typeof experiences>).map((expId) => {
              return (
                <ExperienceCard key={expId} experience={experiences[expId]} />
              );
            })}
          </div>
        </div>

        {/* Education Section */}
        <div id="education" className="scroll-mt-4">
          <SectionHeader icon="🎓" title={t('education.title')} />
          <div className="space-y-4">
            {(Object.keys(educations) as Array<keyof typeof educations>).map((eduId) => {
              return (
                <EducationCard key={eduId} education={educations[eduId]} />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
