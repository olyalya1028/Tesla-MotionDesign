import { Button } from "./Button";
import { Media } from "./Media";

interface SplitCard {
  title: string;
  text: string;
  media: { src: string; alt: string };
  actions: { label: string; lang?: "mn" }[];
}

const cards: SplitCard[] = [
  {
    title: "Current Offers",
    text: "Explore limited-time offers on Tesla vehicles.",
    media: {
      src: "/assets/offers-current.png",
      alt: "Two Tesla vehicles available under current offers",
    },
    actions: [{ label: "Дэлгэрэнгүй", lang: "mn" }],
  },
  {
    title: "Inventory",
    text: "Find new and Certified Pre-Owned Tesla vehicles available immediately.",
    media: {
      src: "/assets/offers-inventory.png",
      alt: "Rows of Tesla vehicles in inventory seen from above",
    },
    actions: [{ label: "New" }, { label: "Pre-Owned" }],
  },
];

export function Quicklinks() {
  return (
    <section className="relative bg-scheme1-bg py-section-lg" id="shop" data-section="shop">
      <div className="w-full px-page">
        <div className="mx-auto w-full max-w-container">
          <ul className="flex items-stretch gap-8 max-767:flex-col max-767:gap-6">
            {cards.map((card) => (
              <li key={card.title} className="flex min-w-0 flex-1">
                <article className="flex w-full min-h-[320px] items-stretch overflow-hidden rounded-card bg-scheme1-fg max-767:min-h-0 max-767:flex-col">
                  <div className="flex min-w-0 flex-[1_1_50%] flex-col justify-center gap-6 p-6 max-767:flex-[0_0_auto]">
                    <div className="flex flex-col gap-2 text-scheme1-text">
                      <h2 className="text-heading-5 font-medium leading-relaxed2 tracking-heading">
                        <span className="inline-block">{card.title}</span>
                      </h2>
                      <p className="text-regular font-normal leading-body">{card.text}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {card.actions.map((action) => (
                        <Button key={action.label} variant="light" lang={action.lang}>
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Media
                    variant="relative"
                    src={card.media.src}
                    alt={card.media.alt}
                    className="min-w-0 flex-[1_1_50%] self-stretch max-767:aspect-[16/10] max-767:w-full max-767:flex-[0_0_auto]"
                  />
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
