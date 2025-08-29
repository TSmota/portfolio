"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProjectCarouselProps {
  images: string[];
  projectName: string;
}

export function ProjectCarousel({ images, projectName }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useTranslations("ide.ariaLabels");

  if (!images || images.length === 0) {
    return null;
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const showNavigationArrows = images.length > 1;

  return (
    <div className="relative mb-4 rounded-lg overflow-hidden bg-muted/30 w-full">
      <div className="relative w-full">
        <Image
          src={images[currentIndex]}
          alt={t("projectScreenshot", { projectName, number: currentIndex + 1 })}
          width={800}
          height={0}
          className="w-full h-auto"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={currentIndex === 0}
          quality={100}
        />
        
        {showNavigationArrows && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors cursor-pointer"
              aria-label={t("previousImage")}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors cursor-pointer"
              aria-label={t("nextImage")}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {showNavigationArrows && (
        <div className="flex justify-center gap-2 py-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                index === currentIndex 
                  ? "bg-primary" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={t("goToImage", { number: index + 1 })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
