import { Button } from "./Button";

const stats = [
  { value: "38,490", icon: "/assets/icon-supercharger.svg", label: "Superchargers" },
  { value: "410", icon: "/assets/icon-destination-charger.svg", label: "Destination Chargers" },
];

export function StatsCharging() {
  return (
    <section className="relative bg-scheme3-bg py-section-lg" id="charging" data-section="charging">
      <div className="w-full px-page">
        <div className="mx-auto w-full max-w-container">
          <div className="flex items-center gap-20 max-1100:flex-col max-1100:items-stretch max-1100:gap-12">
            <div className="flex w-[616px] max-w-full flex-none flex-col gap-8 max-1100:w-full">
              <div className="flex flex-col gap-6 text-scheme3-text">
                <h2 className="text-heading-2 font-medium leading-tight2 tracking-heading">
                  <span className="inline-block">Find Your Charge</span>
                </h2>
                <p className="text-medium leading-body">
                  View the network of Tesla Superchargers and Destination Chargers available near you.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-6 max-480:gap-4">
                <Button variant="dark">View Network</Button>
                <Button variant="light" lang="mn">
                  Дэлгэрэнгүй
                </Button>
              </div>
            </div>

            <ul className="flex min-w-0 flex-1 items-start gap-12 max-767:flex-col max-767:gap-8">
              {stats.map((stat) => (
                <li
                  key={stat.label}
                  className="flex min-w-0 flex-1 flex-col gap-2 border-l border-scheme3-border pl-8 text-scheme3-text max-767:border-l-0 max-767:border-t max-767:pl-0 max-767:pt-6"
                >
                  <div className="flex items-center gap-2.5">
                    <p className="whitespace-nowrap text-heading-2 font-medium leading-tight2 tracking-heading max-480:whitespace-normal">
                      {stat.value}
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element -- plain SVG icon, next/image's optimizer disallows SVG by default */}
                    <img
                      src={stat.icon}
                      alt=""
                      width={56}
                      height={56}
                      aria-hidden="true"
                      className="h-14 w-14 flex-none"
                    />
                  </div>
                  <p className="text-heading-6 font-medium leading-relaxed2 tracking-heading">
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
