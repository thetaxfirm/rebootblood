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

/**
 * EBO3 / EBOO session pricing by blood-volume tier — single source of truth
 * shared by the EBO3 page (full pricing grid) and the Home page summary block.
 */
export type Ebo3VolumeKey = "3L" | "4.5L" | "6L";

export type Ebo3VolumeTier = {
  key: Ebo3VolumeKey;
  label: string;
  blurb: string;
  duration: string;
  single: number;
  pkg3: number;
  pkg6: number;
};

export const EBO3_VOLUME_TIERS: Ebo3VolumeTier[] = [
  { key: "3L", label: "3 Liters", blurb: "Entry protocol — a focused systemic reset.", duration: "~45–60 min", single: 1000, pkg3: 2700, pkg6: 4500 },
  { key: "4.5L", label: "4.5 Liters", blurb: "Our most popular balance of depth and time.", duration: "~60–90 min", single: 1250, pkg3: 3300, pkg6: 5500 },
  { key: "6L", label: "6 Liters", blurb: "Maximum whole-blood volume treated per session.", duration: "~90–120 min", single: 1500, pkg3: 3750, pkg6: 6600 },
];

export const NAV_LINKS = [
  { label: "EBO3 / EBOO", href: "/eboo" },
  { label: "Plasmapheresis", href: "/plasmapheresis" },
  { label: "Learning Center", href: "/learn" },
  { label: "Eligibility Quiz", href: "/eligibility" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/#contact" },
] as const;
