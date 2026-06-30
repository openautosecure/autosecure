import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Zap, Eye, KeyRound, Bot, Lock, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Autosecure — Automatic account security for Microsoft & Minecraft" },
      {
        name: "description",
        content:
          "Autosecure keeps your Microsoft and Minecraft accounts safe. Automated rotation, continuous monitoring, and intelligent verification — set it and forget it.",
      },
      { property: "og:title", content: "Autosecure — Automatic account security" },
      {
        property: "og:description",
        content:
          "Automated security for Microsoft & Minecraft accounts. Rotate credentials, kick intruders, monitor 24/7.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden />

      <Nav />

      <main className="relative">
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="relative z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-[--primary] to-[--accent] text-primary-foreground">
            <Lock className="h-4 w-4" />
          </span>
          Autosecure<span className="text-gradient">.</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition hover:text-foreground">Features</a>
          <a href="#how" className="transition hover:text-foreground">How it works</a>
          <a href="#" className="transition hover:text-foreground">Discord</a>
        </nav>
        <AuthButton />
      </div>
    </header>
  );
}

function AuthButton() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <div className="h-9 w-24 rounded-full bg-card/60" aria-hidden />;
  }

  if (isAuthenticated) {
    return (
      <a
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[--primary] to-[--accent] px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-90"
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </a>
    );
  }

  return (
    <a
      href="/login"
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[--primary] to-[--accent] px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-90"
    >
      Sign in
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}


function Hero() {
  return (
    <section className="relative px-6 pb-24 pt-16 sm:pt-24">
      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[--accent]" />
          Microsoft &amp; Minecraft account security
        </span>

        <h1 className="mt-8 font-display text-5xl font-bold leading-[1.02] sm:text-7xl md:text-8xl">
          Autosecure your accounts
          <br />
          <span className="text-gradient">Automatically</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-base text-muted-foreground sm:text-lg">
          autosec keeps your Microsoft and Minecraft accounts safe — drop your email and OTP
          on Discord or the web, and we rotate credentials, kick intruders, and hand full
          access back to you. Continuous monitoring, intelligent verification.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[--primary] to-[--accent] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:scale-[1.02]"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
          <a
            href="#how"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition hover:bg-card"
          >
            See how it works
          </a>
        </div>

        <div className="mx-auto mt-14 flex max-w-2xl items-start gap-3 rounded-2xl border border-border bg-card/50 p-4 text-left text-sm text-muted-foreground backdrop-blur">
          <span className="mt-0.5 text-base">😋</span>
          <p>
            <span className="font-semibold text-foreground">Not a phisher.</span> Use this tool
            solely on accounts <span className="text-gradient font-semibold">you own</span>. We
            do not take responsibility for misuse.
          </p>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: KeyRound,
    title: "Credential rotation",
    body: "Auto-rotates passwords, recovery emails, and security info to lock out unauthorized users instantly.",
  },
  {
    icon: Eye,
    title: "Continuous monitoring",
    body: "24/7 watch on session activity, IP changes, and login attempts across all linked accounts.",
  },
  {
    icon: Bot,
    title: "Discord + Web access",
    body: "Trigger a full secure flow from our Discord bot or web dashboard. OTP in, secure out.",
  },
  {
    icon: ShieldCheck,
    title: "Intelligent verification",
    body: "Smart OTP handling and challenge resolution — including 2FA edge cases — without losing access.",
  },
  {
    icon: Zap,
    title: "Sub-minute response",
    body: "Average secure time under 60 seconds from token capture to full account lockdown.",
  },
  {
    icon: Lock,
    title: "Zero retention",
    body: "OTPs and tokens are wiped post-flow. We keep what you need, nothing more.",
  },
];

function Features() {
  return (
    <section id="features" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Built to <span className="text-gradient">take it back.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to reclaim and protect Microsoft &amp; Minecraft accounts —
            automated end to end.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative bg-card/80 p-7 transition hover:bg-card"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[--primary] to-[--accent] text-primary-foreground shadow-[var(--shadow-glow)]">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    n: "01",
    title: "Drop your details",
    body: "Send your email + OTP to the Discord bot or paste them into the dashboard.",
  },
  {
    n: "02",
    title: "Autosecure runs the flow",
    body: "We sign in, rotate credentials, remove unauthorized recovery methods, and revoke sessions.",
  },
  {
    n: "03",
    title: "Full access, back to you",
    body: "You receive the new credentials and a clean account — no dhooks or exit scams",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              How it works
            </span>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              Three steps. <br />
              <span className="text-gradient">Under a minute.</span>
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              The whole flow is automated. You bring the OTP — The autosecure handles the rest with
              the same tooling pros use to lock down accounts at scale.
            </p>
          </div>

          <ol className="space-y-4">
            {steps.map((s) => (
              <li
                key={s.n}
                className="relative rounded-2xl border border-border bg-card/60 p-6 backdrop-blur transition hover:border-[--primary]"
              >
                <div className="flex items-start gap-5">
                  <span className="font-display text-3xl font-bold text-gradient">{s.n}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-card/60 p-12 text-center backdrop-blur">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "var(--gradient-radial)" }}
          aria-hidden
        />
        <h2 className="font-display text-4xl font-bold sm:text-5xl">
          Secure your account in <span className="text-gradient">60 seconds.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Free Forever. No subscription, no card. Just paste, secure, and move on.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[--primary] to-[--accent] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:scale-[1.02]"
          >
            Open app
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-6 py-3 text-sm font-medium text-foreground transition hover:bg-background/70"
          >
            Join Discord
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2 font-display font-semibold text-foreground">
          Autosecure<span className="text-gradient">.</span>
        </div>
        <p>© {new Date().getFullYear()} Autosecure. All rights reserved.</p>
      </div>
    </footer>
  );
}
