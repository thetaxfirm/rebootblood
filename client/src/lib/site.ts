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

export const NAV_LINKS = [
  { label: "EBO3 / EBOO", href: "/eboo" },
  { label: "Plasmapheresis", href: "/plasmapheresis" },
  { label: "Eligibility Quiz", href: "/eligibility" },
  { label: "Contact", href: "/#contact" },
] as const;
