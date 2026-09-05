const links = [
  "Privacy policy",
  "Vehicle Recalls",
  "Contacts",
  "News",
  "Get Updates",
  "Locations",
  "Learn",
];

export function Footer() {
  return (
    <footer className="bg-scheme1-bg py-section-md" data-section="footer">
      <div className="w-full px-page">
        <div className="mx-auto w-full max-w-container">
          <div className="flex flex-col gap-8">
            <hr className="h-0 w-full border-0 border-t border-scheme1-border" />

            <div className="flex justify-center">
              <nav className="min-w-0 max-w-footer flex-1" aria-label="Footer">
                <ul className="flex flex-wrap items-start justify-center gap-8 text-small font-semibold leading-body text-scheme1-text max-767:gap-x-6 max-767:gap-y-4">
                  <li className="flex">
                    <span className="block whitespace-nowrap">Tesla &copy; 2026</span>
                  </li>
                  {links.map((label) => (
                    <li key={label} className="flex">
                      <a className="block whitespace-nowrap" href="#">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
