import Image from 'next/image';

import underConstructionImage from '@/assets/under_construction.png';
import { getTranslations } from "next-intl/server";

export async function UnderConstruction() {
  const t = await getTranslations('components.underConstruction');

  return (
    <div className="flex flex-col grow items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
      <p className="text-lg mb-8">{t('description')}</p>
      <Image alt={t('title')} src={underConstructionImage} className="rounded-lg shadow-lg max-w-[80vh]" />
    </div>
  )
}
