import { Media } from "./Media";

export function ChargingMap() {
  return (
    <section className="relative bg-scheme1-bg py-section-lg" id="map" data-section="map">
      <div className="w-full px-page">
        <div className="mx-auto w-full max-w-container">
          <Media
            variant="relative"
            src="/assets/charging-map.png"
            alt="Map of the United States showing Tesla Supercharger locations"
            className="aspect-[1280/720] w-full rounded-card"
          />
        </div>
      </div>
    </section>
  );
}
