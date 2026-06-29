import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { applySettingsFromStorage } from "../lib/theme";
import { Toaster } from "@/components/ui/sonner";

applySettingsFromStorage();

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn&apos;t load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Autosecure" },
      { name: "description", content: "Autosecure Dashboard" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AnimationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const [anim, setAnim] = useState("none");

  useEffect(() => {
    const read = () => setAnim(document.documentElement.getAttribute("data-animation") ?? "none");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-animation"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    cancelAnimationFrame(rafRef.current);

    if (anim === "none") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return () => window.removeEventListener("resize", resize);
    }

    let t = 0;

    if (anim === "starfield") {
      const stars = Array.from({ length: 280 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.6 + 0.3,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.025 + 0.008,
      }));
      const tick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t++;
        for (const s of stars) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < -5) s.x = canvas.width + 5;
          if (s.x > canvas.width + 5) s.x = -5;
          if (s.y < -5) s.y = canvas.height + 5;
          if (s.y > canvas.height + 5) s.y = -5;
          const a = 0.2 + 0.65 * Math.abs(Math.sin(t * s.speed + s.phase));
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
          ctx.fill();
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    else if (anim === "aurora") {
      const tick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t++;
        const time = t * 0.005;
        for (let i = 0; i < 4; i++) {
          const hue  = (i * 80 + t * 0.25) % 360;
          const hue2 = (hue + 60) % 360;
          const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
          grad.addColorStop(0,                `hsla(${hue},75%,60%,0)`);
          grad.addColorStop(0.3 + i * 0.08,  `hsla(${hue},75%,60%,0.15)`);
          grad.addColorStop(0.65 - i * 0.04, `hsla(${hue2},70%,65%,0.15)`);
          grad.addColorStop(1,                `hsla(${hue2},70%,65%,0)`);
          ctx.beginPath();
          const yBase = canvas.height * (0.12 + i * 0.18);
          ctx.moveTo(0, yBase);
          for (let x = 0; x <= canvas.width; x += 4) {
            const y = yBase
              + Math.sin(x * 0.005 + time * 3.0 + i * 1.5) * 90
              + Math.sin(x * 0.011 + time * 4.0 + i * 0.7) * 45;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(canvas.width, 0);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    else if (anim === "particles") {
      const pts = Array.from({ length: 300 }, () => ({
        x:  Math.random() * window.innerWidth,
        y:  window.innerHeight + Math.random() * window.innerHeight,
        r:  Math.random() * 2.5 + 0.5,
        vy: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 1,
        a:  Math.random() * 0.4 + 0.1,
      }));
      const tick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of pts) {
          p.y -= p.vy; p.x += p.vx;
          if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(160,210,255,${p.a.toFixed(2)})`;
          ctx.fill();
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    else if (anim === "rain") {
      const drops = Array.from({ length: 250 }, () => ({
        x:   Math.random() * window.innerWidth,
        y:   Math.random() * window.innerHeight,
        len: Math.random() * 20 + 10,
        vy:  Math.random() * 12 + 6,
        a:   Math.random() * 0.3 + 0.15,
      }));
      const tick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const d of drops) {
          d.y += d.vy;
          if (d.y > canvas.height + d.len) { d.y = -d.len; d.x = Math.random() * canvas.width; }
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x, d.y + d.len);
          ctx.strokeStyle = `rgba(100,220,255,${d.a.toFixed(2)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    else if (anim === "waves") {
      const tick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t++;
        const time = t * 0.03;
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          const yBase = canvas.height * (0.25 + i * 0.1);
          const amp   = 35 + i * 12;
          const freq  = 0.005 - i * 0.0004;
          ctx.moveTo(0, yBase);
          for (let x = 0; x <= canvas.width; x += 4) {
            ctx.lineTo(x, yBase + Math.sin(x * freq + time * 1.0 + i * 1.1) * amp);
          }
          ctx.lineTo(canvas.width, canvas.height);
          ctx.lineTo(0, canvas.height);
          ctx.closePath();
          ctx.fillStyle = `rgba(100,180,255,${Math.max(0, 0.06 - i * 0.008).toFixed(3)})`;
          ctx.fill();
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [anim]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.55 }}
    />
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AnimationCanvas />
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
