/**
 * Navigation SSOT — single definition consumed by Header, MobileMenu, and Footer.
 *
 * Header uses: key, label, href, children (including description for MegaDropdown).
 * MobileMenu uses: key, label, href, children (label only, description ignored).
 * Footer uses: top-level key, label, href (filters out "contact").
 */

export type NavSubItem = {
  key: string;
  label: string;
  href: string;
  description: string;
};

export type NavItem = {
  key: string;
  label: string;
  href: string;
  children?: readonly NavSubItem[];
};

export const NAV_ITEMS: readonly NavItem[] = [
  {
    key: "about",
    label: "About Us",
    href: "/about",
    children: [
      { key: "ceo",          label: "CEO Message",         href: "/about/ceo",                   description: "A note from the founder." },
      { key: "history",      label: "Our History",         href: "/about/history",               description: "Ten years across six countries." },
      { key: "vision",       label: "Vision & Principles", href: "/about/vision",                description: "Perfect work, safe operations." },
      { key: "organization", label: "Organization",        href: "/about/organization",          description: "Cross-functional teams." },
      { key: "clients",      label: "Our Clients",         href: "/about/clients",               description: "National rail operators." },
    ],
  },
  {
    key: "solutions",
    label: "Solutions",
    href: "/solutions",
    children: [
      { key: "light_maintenance", label: "Light Maintenance",        href: "/solutions/light-maintenance",        description: "Daily inspections & functional checks." },
      { key: "heavy_maintenance", label: "Heavy Maintenance",        href: "/solutions/heavy-maintenance",        description: "Full overhauls under warranty." },
      { key: "supply_chain",      label: "Supply Chain",             href: "/solutions/supply-chain",             description: "Parts sourcing across 50+ partners." },
      { key: "digital_asset",     label: "Digital Asset Management", href: "/solutions/digital-asset-management", description: "MMIS platform via VISION IT." },
      { key: "commercial",        label: "Commercial Services",      href: "/solutions/commercial-services",      description: "Station retail & concessions." },
    ],
  },
  {
    key: "portfolios",
    label: "Portfolios",
    href: "/portfolios",
    children: [
      { key: "ukraine",    label: "Ukraine HRCS2 EMU",    href: "/portfolios/ukraine-emu",     description: "90 cars · since 2017." },
      { key: "warsaw",     label: "Tramwaje Warszawskie", href: "/portfolios/warsaw-tram",     description: "123 trams · 140-year network." },
      { key: "uzbekistan", label: "Uzbekistan HSR",       href: "/portfolios/uzbekistan-rail", description: "Launching May 2026." },
      { key: "all",        label: "View All Portfolios",  href: "/portfolios",                 description: "Complete portfolio overview." },
    ],
  },
  { key: "locations", label: "Locations", href: "/locations" },
  { key: "contact",   label: "Contact Us", href: "/contact" },
];
