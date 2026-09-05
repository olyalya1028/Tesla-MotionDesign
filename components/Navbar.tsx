import Image from "next/image";
import { Button } from "./Button";

const navLinks = ["Vehicles", "Energy", "Charging", "Discover", "Shop"];

export function Navbar() {
  return (
    <header className="bg-scheme1-bg" data-section="navbar">
      <div className="flex w-full items-center gap-8 px-page py-4 max-767:flex-wrap max-767:gap-4">
        <div className="flex min-w-0 flex-1 items-start max-767:order-1 max-767:flex-[1_1_auto]">
          <a className="block" href="#" aria-label="Tesla — home">
            <Image
              src="/assets/tesla-logo.png"
              alt="Tesla"
              width={106}
              height={14}
              className="h-[14px] w-[106px] object-contain"
              priority
            />
          </a>
        </div>

        <nav
          className="flex-none max-767:order-3 max-767:flex-[1_0_100%] max-767:overflow-x-auto max-767:no-scrollbar"
          aria-label="Primary"
        >
          <ul className="flex items-center gap-8 max-767:gap-6">
            {navLinks.map((label) => (
              <li key={label}>
                <a
                  className="inline-flex items-center justify-center whitespace-nowrap text-regular font-normal leading-body text-scheme1-text"
                  href="#"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-w-0 flex-1 items-center justify-end max-767:order-2 max-767:flex-[0_0_auto]">
          <Button variant="primary" size="sm" magnetic cal lang="mn">
            Жолоодож үзэх
          </Button>
        </div>
      </div>
    </header>
  );
}
