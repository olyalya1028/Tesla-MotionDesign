import { Button } from "./Button";
import { Media } from "./Media";

export function Hero() {
  return (
    <section
      className="relative flex h-hero overflow-hidden"
      id="hero"
      data-section="hero"
    >
      <Media
        variant="fill"
        src="/assets/hero-model-3.png"
        alt="Tesla Model 3 driving on a desert highway"
        priority
        className="z-0"
      />

      <div className="relative z-10 flex w-full justify-center px-page pt-page">
        <div className="flex w-full max-w-container flex-col items-center">
          <div className="flex w-full max-w-3xl flex-col items-center gap-8">
            <div className="flex w-full flex-col gap-6 text-center text-white">
              <h1 className="text-heading-1 font-medium leading-tight2 tracking-heading">
                <span className="inline-block">Model 3</span>
              </h1>
              <p className="text-medium font-normal leading-body">
                <span className="inline-block">1.99% APR Available</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button variant="primary" magnetic lang="mn">
                Одоо захиалах
              </Button>
              <Button variant="light" lang="mn">
                Дэлгэнгүй үзэх
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
