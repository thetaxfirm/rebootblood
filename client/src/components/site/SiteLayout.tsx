import { ReactNode } from "react";
import Navbar from "./Navbar";
import SiteFooter from "./SiteFooter";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function Eyebrow({ children, tone = "garnet" }: { children: ReactNode; tone?: "garnet" | "gold" }) {
  return (
    <p className="eyebrow" style={{ color: tone === "gold" ? "var(--gold)" : "var(--garnet)" }}>
      {children}
    </p>
  );
}
