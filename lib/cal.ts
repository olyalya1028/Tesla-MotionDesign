// Single Cal.com "Pop up via element click" booking target used by every
// test-drive CTA on the site. Cal's embed.js listens for clicks on any
// element carrying these data-cal-* attributes and opens its own modal — it
// never calls preventDefault(), so the trigger's href must stay "#" or the
// browser will navigate away before (or instead of) the modal opening.
export const CAL_NAMESPACE = "dev20-test";
export const CAL_LINK = "olya-ganbold-s5x6rz/dev20-test";
export const CAL_CONFIG = JSON.stringify({
  layout: "month_view",
  useSlotsViewOnSmallScreen: "true",
});

export const calTriggerProps = {
  "data-cal-link": CAL_LINK,
  "data-cal-namespace": CAL_NAMESPACE,
  "data-cal-config": CAL_CONFIG,
} as const;
