import { Slider } from "./Slider";
import type { SlideData } from "@/lib/slides";

interface ShowcaseSectionProps {
  id: string;
  slides: SlideData[];
}

// The track deliberately overruns the 1280px container; the section clips it
// at the page edge, exactly as the Figma frame does (overflow-clip below).
export function ShowcaseSection({ id, slides }: ShowcaseSectionProps) {
  return (
    <section
      className="relative overflow-clip bg-scheme1-bg py-section-lg"
      id={id}
      data-section={id}
    >
      <div className="w-full px-page">
        <div className="mx-auto w-full max-w-container">
          <Slider id={id} slides={slides} />
        </div>
      </div>
    </section>
  );
}
