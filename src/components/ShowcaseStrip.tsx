import { Reveal } from "./Reveal";

function PhoneCoverCard() {
  return (
    <div className="relative mx-auto h-44 w-28">
      {/* phone */}
      <svg viewBox="0 0 110 180" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
        <rect x="5" y="5" width="100" height="170" rx="16" fill="#1a2f5a" stroke="#FFB300" strokeWidth="1.5" />
        <rect x="14" y="18" width="82" height="140" rx="8" fill="#0A1931" />
        <circle cx="55" cy="168" r="3" fill="#FFB300" />
      </svg>
      {/* snapping cover */}
      <div className="absolute inset-0 animate-cover-snap">
        <svg viewBox="0 0 110 180" className="h-full w-full" fill="none" aria-hidden>
          <rect x="3" y="3" width="104" height="174" rx="18" fill="#FFB300" opacity="0.85" />
          <rect x="14" y="18" width="82" height="140" rx="8" fill="rgba(10,25,49,0.15)" />
        </svg>
      </div>
    </div>
  );
}

function ChargerCard() {
  return (
    <div className="relative mx-auto grid h-44 w-28 place-items-center">
      {/* sparks */}
      <span className="absolute h-16 w-16 rounded-full bg-gold/30 animate-spark-burst" />
      <span className="absolute h-16 w-16 rounded-full bg-gold/30 animate-spark-burst" style={{ animationDelay: "0.6s" }} />
      {/* bolt */}
      <svg viewBox="0 0 60 80" className="relative h-24 w-24 animate-bolt-pulse" aria-hidden>
        <path d="M34 4 L10 44 L26 44 L22 76 L50 32 L34 32 Z" fill="#FFB300" stroke="#FFD45a" strokeWidth="1.5" />
      </svg>
      {/* cable drawing */}
      <svg viewBox="0 0 100 60" className="absolute bottom-0 h-12 w-full" aria-hidden>
        <path
          d="M10 55 Q30 30 50 40 T90 10"
          stroke="#FFB300"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="120"
          strokeDashoffset="120"
          className="animate-draw-line"
        />
      </svg>
    </div>
  );
}

function EarbudsCard() {
  return (
    <div className="relative mx-auto grid h-44 w-44 place-items-center">
      {/* left earbud + sonar */}
      <div className="absolute left-2 top-6">
        <span className="absolute inset-0 m-auto block h-12 w-12 rounded-full border-2 border-gold animate-sonar" />
        <span className="absolute inset-0 m-auto block h-12 w-12 rounded-full border-2 border-gold animate-sonar" style={{ animationDelay: "0.6s" }} />
        <span className="absolute inset-0 m-auto block h-12 w-12 rounded-full border-2 border-gold animate-sonar" style={{ animationDelay: "1.2s" }} />
        <svg viewBox="0 0 60 80" className="relative h-14 w-14" aria-hidden>
          <ellipse cx="30" cy="22" rx="18" ry="20" fill="#ffffff" stroke="#0A1931" strokeWidth="1.5" />
          <rect x="25" y="38" width="10" height="36" rx="5" fill="#ffffff" stroke="#0A1931" strokeWidth="1.5" />
        </svg>
      </div>
      {/* right earbud + sonar */}
      <div className="absolute bottom-2 right-2">
        <span className="absolute inset-0 m-auto block h-12 w-12 rounded-full border-2 border-gold animate-sonar" style={{ animationDelay: "0.3s" }} />
        <span className="absolute inset-0 m-auto block h-12 w-12 rounded-full border-2 border-gold animate-sonar" style={{ animationDelay: "0.9s" }} />
        <span className="absolute inset-0 m-auto block h-12 w-12 rounded-full border-2 border-gold animate-sonar" style={{ animationDelay: "1.5s" }} />
        <svg viewBox="0 0 60 80" className="relative h-14 w-14 scale-x-[-1]" aria-hidden>
          <ellipse cx="30" cy="22" rx="18" ry="20" fill="#ffffff" stroke="#0A1931" strokeWidth="1.5" />
          <rect x="25" y="38" width="10" height="36" rx="5" fill="#ffffff" stroke="#0A1931" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}

function Card({ children, title, subtitle, delay }: { children: React.ReactNode; title: string; subtitle: string; delay: number }) {
  return (
    <Reveal delay={delay} className="group">
      <div className="rounded-3xl border-2 border-transparent bg-navy-light/40 p-6 text-center transition-all duration-300 hover:scale-[1.05] hover:border-gold hover:shadow-[0_10px_40px_-10px_rgba(255,179,0,0.55)]">
        <div className="grid h-48 place-items-center">{children}</div>
        <div className="mt-4 text-lg font-extrabold text-white">{title}</div>
        <div className="mt-1 text-sm font-semibold text-gold">{subtitle}</div>
      </div>
    </Reveal>
  );
}

export function ShowcaseStrip() {
  return (
    <section className="bg-navy py-16 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal variant="left" className="text-center">
          <h2 className="text-3xl font-extrabold text-gold md:text-4xl">What We Offer</h2>
          <p className="mt-2 text-sm text-white/70">Crafted accessories for every device</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card title="Mobile Covers" subtitle="100+ Designs Available" delay={0}><PhoneCoverCard /></Card>
          <Card title="Fast Chargers" subtitle="All Models Supported" delay={120}><ChargerCard /></Card>
          <Card title="Premium Earbuds" subtitle="Crystal Clear Sound" delay={240}><EarbudsCard /></Card>
        </div>
      </div>
    </section>
  );
}
