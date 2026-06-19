/** Central brand + contact constants and shared asset paths for the site. */
export const SITE = {
  name: "rEBOOtBlood",
  domain: "rEBOOtBlood.com",
  phoneDisplay: "(888) 555-0123",
  phoneHref: "tel:+18885550123",
  email: "care@rebootblood.com",
  emailHref: "mailto:care@rebootblood.com",
  deviceName: "EBOO O3 Research Device 2026",
} as const;

export const ASSETS = {
  heroAbstract: "/manus-storage/hero_blood_abstract_91aac753.png",
  plasmaAbstract: "/manus-storage/plasma_abstract_c523d8bc.png",
  clinicInterior: "/manus-storage/clinic_interior_13ed0b23.png",
  ctaBand: "/manus-storage/cta_band_7f242402.png",
  device: "/manus-storage/eboo_device_real_812e4903.png",
  logo: "/manus-storage/logo_mark_b729685e.png",
} as const;

/**
 * Partner program terms. Edit DEFAULT_REVENUE_SHARE_PCT here to keep the
 * calculator default in sync with current program terms — it is the single
 * source of truth consumed by the economics calculator.
 */
export const PARTNER_PROGRAM: { defaultRevenueSharePct: number } = {
  defaultRevenueSharePct: 30,
};

/**
 * Plasmapheresis program tiers — single source of truth shared by the
 * Plasmapheresis page and the Home page pricing section so prices stay in sync.
 */
export type PlasmaTier = {
  name: string;
  price: string;
  tagline: string;
  points: string[];
  featured: boolean;
};

export const PLASMAPHERESIS_TIERS: PlasmaTier[] = [
  {
    name: "Core",
    price: "$6,500",
    tagline: "A foundational single-exchange program",
    points: [
      "Consultation & baseline labs",
      "One therapeutic plasma exchange",
      "In-session monitoring",
      "Follow-up review",
    ],
    featured: false,
  },
  {
    name: "Complete",
    price: "$18,000",
    tagline: "A comprehensive multi-session program",
    points: [
      "Full diagnostic workup",
      "A series of plasma exchanges",
      "Optional EBO3 add-on",
      "Concierge follow-up & optimization",
    ],
    featured: true,
  },
];

export const NAV_LINKS = [
  { label: "EBO3 / EBOO", href: "/eboo" },
  { label: "Plasmapheresis", href: "/plasmapheresis" },
  { label: "Learning Center", href: "/learn" },
  { label: "Eligibility Quiz", href: "/eligibility" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/#contact" },
] as const;
