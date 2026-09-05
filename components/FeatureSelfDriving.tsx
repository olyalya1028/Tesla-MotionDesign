import { Button } from "./Button";
import { Media } from "./Media";

const metrics = [
  { value: "7x", label: "Fewer Collisions" },
  { value: "13,534,294,722", label: "Miles Driven" },
];

export function FeatureSelfDriving() {
  return (
    <section
      className="relative bg-scheme1-bg py-section-lg"
      id="self-driving"
      data-section="self-driving"
    >
      <div className="w-full px-page">
        <div className="mx-auto w-full max-w-container">
          <article className="flex min-h-[480px] items-stretch overflow-hidden rounded-card bg-scheme1-fg max-900:min-h-0 max-900:flex-col">
            <div className="flex min-w-0 flex-[1_1_50%] flex-col justify-center gap-8 p-12 max-900:flex-[0_0_auto] max-900:p-8">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-6 text-scheme1-text">
                  <h2 className="text-heading-3 font-medium leading-tight2 tracking-heading">
                    <span className="inline-block">Full Self-Driving (Supervised)</span>
                  </h2>
                  <p className="text-medium leading-body">
                    Makes every drive easier. Subscribe for $99/mo.
                    <sup className="top-0 align-baseline text-[length:inherit] leading-[inherit]">1</sup>
                  </p>
                </div>

                <ul className="flex gap-6 py-2 text-scheme1-text max-900:gap-4 max-767:flex-col max-767:gap-6">
                  {metrics.map((m) => (
                    <li key={m.label} className="flex min-w-0 flex-1 flex-col gap-2">
                      <p className="text-heading-4 font-medium leading-snug2 tracking-heading">
                        {m.value}
                      </p>
                      <p className="text-regular font-medium leading-body">{m.label}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-6 max-480:gap-4">
                <Button variant="dark" cal lang="mn">
                  Жолоодож үзэх цаг авах
                </Button>
                <Button variant="light" lang="mn">
                  Дэлгэрэнгүй
                </Button>
              </div>
            </div>

            <Media
              variant="relative"
              src="/assets/fsd-interior.png"
              alt="View from inside a Tesla using Full Self-Driving through a busy street"
              className="min-w-0 flex-[1_1_50%] self-stretch max-900:aspect-[4/3] max-900:w-full max-900:flex-[0_0_auto]"
            />
          </article>
        </div>
      </div>
    </section>
  );
}
