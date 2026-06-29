import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef, createContext, useContext, useLayoutEffect } from "react";
import { ReactSkinview3d } from "react-skinview3d";
import {
  LayoutDashboard, Users, Settings, LogOut, Lock, ShieldCheck, Link2, TrendingUp,
  Search, Bell, ChevronRight, Activity, Award, Power, KeyRound, Layers, Fingerprint,
  FileKey, ArrowLeft, Loader2, BarChart2, Trophy, Calendar, Zap, X,
  Palette, Sparkles, SlidersHorizontal, Type, Shield, Eye, EyeOff, RotateCcw,
  Monitor, Star, CloudRain, Waves, Check, Inbox, Plus, Mail, Crosshair, Download, Copy,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { clearAuthToken, getAuthToken, useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  THEME_PRESETS, DEFAULT_SETTINGS, loadSettings, saveSettings, previewColors,
  type ThemeSettings, type ThemePreset, type AnimationType,
  type InterfaceFont, type MonoFont,
} from "@/lib/theme";

type Notification = { id: number; title: string; description?: string; time: number };

const NotificationContext = createContext<{
  notifications: Notification[];
  addNotification: (title: string, description?: string) => void;
  clearNotifications: () => void;
}>({ notifications: [], addNotification: () => {}, clearNotifications: () => {} });

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Autosecure" },
      { name: "description", content: "Manage your secured accounts." },
    ],
  }),
  component: DashboardPage,
});

type Tab = "overview" | "accounts" | "secure" | "emails" | "settings";

function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifId = useRef(0);

  const addNotification = useCallback((title: string, description?: string) => {
    const id = ++notifId.current;
    setNotifications(prev => [{ id, title, description, time: Date.now() }, ...prev].slice(0, 50));
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  if (isAuthenticated === false) {
    navigate({ to: "/login" });
    return null;
  }

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[--primary] border-t-transparent" />
      </div>
    );
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden />
        <div className="relative flex min-h-screen">
          <Sidebar tab={tab} setTab={setTab} />
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col animate-in fade-in duration-300">
              {tab === "overview" && <Overview />}
              {tab === "accounts" && <Accounts />}
              {tab === "emails" && <EmailsPanel />}
              {tab === "secure" && <Secure />}
              {tab === "settings" && <SettingsPanel />}
            </main>
          </div>
        </div>
      </div>
    </NotificationContext.Provider>
  );
}

function Sidebar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const navigate = useNavigate();

  const items: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "accounts", label: "Accounts", icon: Users },
    { id: "emails",   label: "Emails",   icon: Inbox },
    { id: "secure", label: "Secure", icon: ShieldCheck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur md:flex">
      <div className="flex h-16 items-center gap-2 px-6">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-[--primary] to-[--accent] text-primary-foreground">
          <Lock className="h-4 w-4" />
        </span>
        <span className="font-display text-lg font-bold tracking-tight">
          Autosecure<span className="text-gradient">.</span>
        </span>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-gradient-to-r from-[--primary]/85 to-[--accent]/75 text-foreground shadow-sm border border-[--primary]/30"
                  : "text-muted-foreground hover:bg-card/85 hover:text-foreground"
              }`}
            >
              <item.icon className={`h-4 w-4 ${active ? "text-[--primary]" : ""}`} />
              {item.label}
              {active && <ChevronRight className="ml-auto h-4 w-4 text-[--primary]" />}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={() => { clearAuthToken(); navigate({ to: "/" }); }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-card/60 hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

function Topbar() {
  const [username, setUsername] = useState("A");
  const [open, setOpen] = useState(false);
  const { notifications, clearNotifications } = useContext(NotificationContext);
  const ref = useRef<HTMLDivElement>(null);
  const lastReadCount = useRef(0);
  const unread = Math.max(0, notifications.length - lastReadCount.current);

  useEffect(() => {
    fetch("/api/me", { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setUsername((d.username as string || "A").charAt(0).toUpperCase()));
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-end gap-4 border-b border-border bg-background/80 px-6 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <div ref={ref} className="relative">
          <button
            onClick={() => {
              setOpen(!open);
              if (!open) lastReadCount.current = notifications.length;
            }}
            className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/60 text-muted-foreground transition hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notifications</span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-xs text-muted-foreground underline-offset-2 hover:underline hover:text-foreground transition"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-muted-foreground">No notifications yet</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="border-l-2 border-l-[--primary]/40 border-b border-border/50 px-4 py-3 last:border-b-0 bg-[--primary]/[0.02] hover:bg-[--primary]/[0.04] transition-colors">
                      <div className="text-sm font-medium">{n.title}</div>
                      {n.description && <div className="mt-0.5 text-xs text-muted-foreground">{n.description}</div>}
                      <div className="mt-1 text-[10px] text-muted-foreground/60">{formatRelativeTime(n.time)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[--primary] to-[--accent] text-sm font-semibold text-primary-foreground">
          {username}
        </div>
      </div>
    </header>
  );
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

type DetailedStats = {
  best_day: string | null;
  best_day_count: number;
  best_month: string | null;
  best_month_count: number;
  daily_avg: number;
  days_active: number;
};

function StatsModal({ onClose }: { onClose: () => void }) {
  const [ds, setDs] = useState<DetailedStats | null>(null);

  useEffect(() => {
    fetch("/api/detailed-stats", { headers: authHeaders() })
      .then(r => r.json())
      .then(setDs);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card/95 p-6 shadow-2xl backdrop-blur" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-[--primary]" />
            <h2 className="font-display text-lg font-semibold">Statistics Overview</h2>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-yellow-500">
              <Trophy className="h-3.5 w-3.5" /> Best Day
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{ds?.best_day ?? "N/A"}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ds?.best_day ? `${ds.best_day_count} secures` : "No data yet"}</p>
          </div>

          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-pink-500">
              <Calendar className="h-3.5 w-3.5" /> Best Month
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{ds?.best_month ?? "N/A"}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ds?.best_month ? `${ds.best_month_count} secures` : "No data yet"}</p>
          </div>

          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[--accent]">
              <Zap className="h-3.5 w-3.5" /> Daily Avg
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{ds?.daily_avg ?? 0}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ds?.days_active ?? 0} accounts / day</p>
          </div>

          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[--primary]">
              <TrendingUp className="h-3.5 w-3.5" /> Days Active
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{ds?.days_active ?? 0}</p>
            <p className="mt-1 text-xs text-muted-foreground">days with at least 1 hit</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Overview() {
  const [stats, setStats] = useState({ total: 0, has_minecraft: 0, shared_links: 0 });
  const [chartData, setChartData] = useState<{ day: string; secures: number }[]>([]);
  const [recent, setRecent] = useState<{ ms_email: string; mc_name: string; secured_at: string }[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/stats", { headers: authHeaders() })
      .then(r => r.json())
      .then(setStats);
    fetch("/api/chart", { headers: authHeaders() })
      .then(r => r.json())
      .then(setChartData);
    fetch("/api/accounts", { headers: authHeaders() })
      .then(r => r.json())
      .then((rows: { ms_email: string; mc_name: string; secured_at: string }[]) => setRecent(rows.slice(0, 5)));
  }, []);

  const statCards = [
    { label: "Total Secured", value: String(stats.total), icon: Users, accent: false },
    { label: "Has Minecraft", value: String(stats.has_minecraft), icon: ShieldCheck, accent: true },
    { label: "Shared Links", value: String(stats.shared_links ?? 0), icon: Link2, accent: false },
  ];

  return (
    <div className="space-y-6">
      {showModal && <StatsModal onClose={() => setShowModal(false)} />}

      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your account security at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setShowModal(true)}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur text-left transition hover:border-[--primary]/40 hover:bg-card/80"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className={`grid h-10 w-10 place-items-center rounded-lg ${s.accent ? "bg-gradient-to-br from-[--primary] to-[--accent] text-primary-foreground shadow-[var(--shadow-glow)]" : "bg-muted text-muted-foreground"}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 font-display text-2xl font-bold">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] animate-in fade-in duration-500 delay-200">
        <SecureHistoryChart data={chartData} />
        <RecentSecures items={recent} />
      </div>
    </div>
  );
}

function SecureHistoryChart({ data }: { data: { day: string; secures: number }[] }) {
  const [primary, setPrimary] = useState("#888");
  const [borderColor, setBorderColor] = useState("#333");
  useEffect(() => {
    const el = document.createElement("div");
    el.style.cssText = "position:fixed;left:-999px;top:-999px;width:1px;height:1px;";
    el.style.background = "var(--primary)";
    el.style.borderColor = "var(--border)";
    document.body.appendChild(el);
    const bg = getComputedStyle(el).backgroundColor;
    const bc = getComputedStyle(el).borderColor;
    document.body.removeChild(el);
    if (bg) setPrimary(bg);
    if (bc) setBorderColor(bc);
  }, [data]);

    if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Secure History</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Secures over the last 7 days</p>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-8 w-8 opacity-40" />
          <p>No data yet — secure your first account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Secure History</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Secures over the last 7 days</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Activity className="h-3 w-3 text-[--accent]" />
          Live
        </span>
      </div>
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="securesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={primary} stopOpacity={0.4} />
                <stop offset="100%" stopColor={primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={borderColor} vertical={false} />
            <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={40} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "0.75rem", fontSize: "0.875rem", color: "var(--foreground)" }}
              labelStyle={{ color: "var(--muted-foreground)" }}
            />
            <Area type="monotone" dataKey="secures" stroke={primary} strokeWidth={2} fill="url(#securesFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RecentSecures({ items }: { items: { ms_email: string; mc_name: string; secured_at: string }[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Recent Secures</h2>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No accounts secured yet.</p>
      ) : (
        <ul className="mt-4 space-y-1">
          {items.map((s, i) => (
            <li key={i} className="animate-in fade-in slide-in-from-right-2 duration-400 flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-background/40" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {(s.ms_email || "?")[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{s.ms_email}</p>
                <p className="text-xs text-muted-foreground">{s.mc_name}</p>
              </div>
              <span className="shrink-0 rounded-full bg-[--accent]/10 px-2.5 py-0.5 text-xs font-medium text-[--accent]">
                Secured
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type Account = {
  claim_id: string;
  ms_email: string;
  mc_name: string;
  mc_method: string;
  mc_gamertag: string;
  mc_capes: string;
  secured_at: string;
  ms_security_email?: string;
  ms_password?: string;
  ms_recovery_code?: string;
  ms_auth_secret?: string;
  ms_first_name?: string;
  ms_last_name?: string;
  ms_full_name?: string;
  ms_region?: string;
  ms_birthday?: string;
  ms_language?: string;
  ms_family?: string;
  ms_devices?: string;
  ms_cards?: string;
  ms_subscriptions_active?: string;
  ms_subscriptions_canceled?: string;
  ms_subscriptions_commercial?: string;
  mc_ssid?: string;
  mc_uchange?: string;
};

const MOCK_PREVIEW = {
  username: "Notch",
  email: "notch@mail.com",
  security_email: "notch@protonmail.com",
  password: "hunter2",
  recovery: "ABCD-EFGH-IJKL-MNOP",
  auth_secret: "JBSWY3DPEHPK3PXP",
  capes: "Migrator, Founder",
  created_at: "2024-01-15",
  id: "1337",
};

const TOKENS = [
  "{username}", "{email}", "{security_email}", "{password}",
  "{recovery}", "{auth_secret}", "{capes}", "{created_at}", "{id}",
];

const PRESETS = [
  { label: "email:password",     template: "{email}:{password}" },
  { label: "user:password",      template: "{username}:{password}" },
  { label: "email:password:2fa", template: "{email}:{password}:{auth_secret}" },
  { label: "email:recovery",     template: "{email}:{recovery}" },
];

function renderPreview(template: string): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => (MOCK_PREVIEW as any)[k] ?? `{${k}}`);
}

function ExportModal({ accounts, onClose }: { accounts: Account[]; onClose: () => void }) {
  const [template, setTemplate] = useState("{username}:{email}:{password}");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const insertToken = (token: string) => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart ?? template.length;
    const end = el.selectionEnd ?? template.length;
    const next = template.slice(0, start) + token + template.slice(end);
    setTemplate(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + token.length, start + token.length);
    });
  };

  const download = () => {
    const lines = accounts.map(a => {
      const map: Record<string, string> = {
        username: a.mc_name ?? a.mc_gamertag ?? "",
        email: a.ms_email ?? "",
        security_email: a.ms_security_email ?? "",
        password: a.ms_password ?? "",
        recovery: a.ms_recovery_code ?? "",
        auth_secret: a.ms_auth_secret ?? "",
        capes: a.mc_capes ?? "",
        created_at: a.secured_at?.slice(0, 10) ?? "",
        id: a.claim_id ?? "",
      };
      return template.replace(/\{(\w+)\}/g, (_, k) => map[k] ?? `{${k}}`);
    }).join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `accounts_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="flex w-[560px] flex-col rounded-2xl border border-border bg-card shadow-2xl backdrop-blur animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        {/* accent bar */}
        <div className="h-1 shrink-0 rounded-t-2xl bg-gradient-to-r from-[--primary] to-[--accent]" />

        {/* header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-5">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[--accent]/15 text-[--accent]">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">Export All Accounts</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Build a custom line format using <code className="rounded bg-muted px-1 text-xs font-mono text-foreground">{"{token}"}</code> placeholders</p>
            </div>
          </div>
          <button onClick={onClose} className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* template input */}
        <div className="px-6 pt-5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Line Template</label>
          <textarea
            ref={inputRef}
            value={template}
            onChange={e => setTemplate(e.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 font-mono text-sm outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30"
          />
        </div>

        {/* tokens */}
        <div className="px-6 pt-4">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Insert Token</label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {TOKENS.map(t => (
              <button
                key={t}
                onClick={() => insertToken(t)}
                className="rounded-md border border-border bg-background/40 px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition hover:border-[--accent]/40 hover:bg-[--accent]/10 hover:text-[--accent]"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* presets */}
        <div className="px-6 pt-4">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Presets</label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => setTemplate(p.template)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  template === p.template
                    ? "border-[--primary]/50 bg-[--primary]/15 text-[--primary]"
                    : "border-border bg-background/40 text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* preview */}
        <div className="px-6 pt-4 pb-6">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview</label>
          <div className="mt-1.5 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-background/30 px-3.5 py-3">
            <code className="text-sm font-mono text-foreground/80">{renderPreview(template)}</code>
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
            Cancel
          </button>
          <button onClick={download} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[--primary] to-[--accent] px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_20px_-6px_color-mix(in_oklab,var(--primary)_40%,transparent)] transition hover:opacity-95">
            <Download className="h-4 w-4" />
            Download File
          </button>
        </div>
      </div>
    </div>
  );
}

function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Account | null>(null);
  const [showHits, setShowHits] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const prevCount = useRef(0);
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    const load = () =>
      fetch("/api/accounts", { headers: authHeaders() })
        .then(r => r.json())
        .then((data: Account[]) => {
          if (prevCount.current > 0 && data.length > prevCount.current) {
            const newCount = data.length - prevCount.current;
            addNotification(`${newCount} new account${newCount > 1 ? "s" : ""} secured`, "Added to the database.");
          }
          prevCount.current = data.length;
          setAccounts(data);
        });
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const hits = accounts.filter(a => !a.mc_name);
  const filtered = (showHits ? hits : accounts).filter(a =>
    a.ms_email?.toLowerCase().includes(search.toLowerCase()) ||
    a.mc_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    return <AccountDetail account={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="flex-1 flex flex-col space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Secured Accounts</h1>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {showHits ? `${hits.length} hit${hits.length !== 1 ? "s" : ""}` : `${accounts.length - hits.length} account${accounts.length - hits.length !== 1 ? "s" : ""}`} in database
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search email or MC username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card/60 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30"
          />
        </div>
        <button
          onClick={() => setShowHits(!showHits)}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
            showHits
              ? "border-[--accent]/50 bg-[--accent]/15 text-[--accent]"
              : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Crosshair className="h-4 w-4" />
          {showHits ? "Hits" : "Accounts"}
          <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
            showHits ? "bg-[--accent]/20 text-[--accent]" : "bg-muted text-muted-foreground"
          }`}>
            {showHits ? hits.length : accounts.length - hits.length}
          </span>
        </button>
        <button
          onClick={() => setShowExport(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {showExport && <ExportModal accounts={accounts} onClose={() => setShowExport(false)} />}

      {filtered.length === 0 ? (
        <div className="flex-1 rounded-2xl border border-border bg-card/40 backdrop-blur flex items-center justify-center">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full border-2 border-[--accent]/60 text-[--accent]">
              <Power className="h-9 w-9" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold">{showHits ? "No hits yet" : "No accounts yet"}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {showHits
                ? "Accounts without a Minecraft name appear here."
                : "Accounts appear here after being secured via the bot or the Secure tab."}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
          {filtered.map((a, i) => (
            <div key={a.claim_id} className="db-acct-card animate-in fade-in slide-in-from-bottom-3 duration-500" onClick={() => setSelected(a)} style={{ animationDelay: `${i * 60}ms` }}>
              <div className="db-acct-img-section">
                <img
                  src={`https://mc-heads.net/player/${a.mc_name || "MHF_Steve"}`}
                  alt={a.mc_name}
                  className="db-acct-skin"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://mc-heads.net/player/MHF_Steve"; }}
                />
                <span className="db-acct-time">{a.secured_at?.slice(0, 10) ?? "—"}</span>
              </div>
              <div className="db-acct-info-section">
                <div className="db-acct-name">{a.mc_name || a.mc_gamertag || "—"}</div>
                <div className="db-acct-stats">
                  <div className="db-acct-stat">
                    <div className="db-acct-stat-label">Email</div>
                    <div className="db-acct-stat-val">{a.ms_email || "—"}</div>
                  </div>
                  <div className="db-acct-stat">
                    <div className="db-acct-stat-label">Method</div>
                    <div className="db-acct-stat-val">{a.mc_method || "—"}</div>
                  </div>
                  <div className="db-acct-stat">
                    <div className="db-acct-stat-label">Gamertag</div>
                    <div className="db-acct-stat-val">{a.mc_gamertag || "—"}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="db-detail-stat-copy"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
      title="Copy"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

/* ── AccountDetail ── */
function AccountDetail({ account, onBack }: { account: Account; onBack: () => void }) {
  const [detail, setDetail] = useState<Account>(account);
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [showMail, setShowMail] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<EmailMessage | null>(null);
  const [skinSize, setSkinSize] = useState<{ width: number; height: number } | null>(null);
  const skinRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = skinRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setSkinSize({ width: Math.round(width), height: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fmtList = (v: unknown, fallback: string) => {
    if (!v || (Array.isArray(v) && v.length === 0) || v === "[]" || v === "{}") return fallback;
    return String(v);
  };

  useEffect(() => {
    fetch(`/api/accounts/${account.claim_id}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => setDetail({ ...account, ...data }))
      .catch(() => {});
  }, [account.claim_id]);

  useEffect(() => {
    fetch("/api/emails", { headers: authHeaders() })
      .then(r => r.json())
      .then(setEmails)
      .catch(() => {});
    const interval = setInterval(() => {
      fetch("/api/emails", { headers: authHeaders() })
        .then(r => r.json())
        .then(setEmails)
        .catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const matchedEmail = emails.find(e => e.email === detail.ms_security_email);

  return (
    <div className="db-detail-view">
      <button onClick={onBack} className="db-detail-back-btn">
        <ArrowLeft className="h-4 w-4" />
        Back to all accounts
      </button>

      <div className="db-detail-top">
        <div className="db-skin-viewer-card" ref={skinRef}>
          {skinSize && (
          <ReactSkinview3d
            skinUrl={`https://mc-heads.net/skin/${detail.mc_name || "MHF_Steve"}`}
            capeUrl={detail.mc_capes && detail.mc_name ? `https://mc-heads.net/cape/${detail.mc_name}` : undefined}
            width={skinSize.width}
            height={skinSize.height}
          />
          )}
        </div>

        <div className="db-detail-info-card">
          <div className="db-detail-heading">
            {detail.mc_name || detail.ms_email || "—"}
          </div>
          <hr className="border-t border-border/30" />
          <div className="db-detail-info-grid">
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Email</div>
              <div className="db-detail-stat-value" title={detail.ms_email}>{detail.ms_email}</div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Method</div>
              <span className="db-detail-stat-value" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                {detail.mc_method || "—"}
              </span>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Secured</div>
              <div className="db-detail-stat-value">{detail.secured_at?.slice(0, 16).replace("T", " ") ?? "—"}</div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Name</div>
              <div className="db-detail-stat-value">{detail.ms_full_name || detail.ms_first_name ? `${detail.ms_first_name || ""} ${detail.ms_last_name || ""}`.trim() : "—"}</div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Security Email</div>
              <div className="db-detail-stat-value-wrapper">
                <span className="db-detail-stat-value" title={detail.ms_security_email}>{detail.ms_security_email || "—"}</span>
                {detail.ms_security_email && <CopyButton text={detail.ms_security_email} />}
              </div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Password</div>
              <div className="db-detail-stat-value-wrapper">
                <span className="db-detail-stat-value" style={{ fontFamily: "var(--font-mono, monospace)" }}>{detail.ms_password || "—"}</span>
                {detail.ms_password && <CopyButton text={detail.ms_password} />}
              </div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Auth Secret</div>
              <div className="db-detail-stat-value-wrapper">
                <span className="db-detail-stat-value" style={{ fontFamily: "var(--font-mono, monospace)" }}>{detail.ms_auth_secret || "—"}</span>
                {detail.ms_auth_secret && <CopyButton text={detail.ms_auth_secret} />}
              </div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Recovery Code</div>
              <div className="db-detail-stat-value-wrapper">
                <span className="db-detail-stat-value" style={{ wordBreak: "break-all", whiteSpace: "normal" }}>{detail.ms_recovery_code || "—"}</span>
                {detail.ms_recovery_code && <CopyButton text={detail.ms_recovery_code} />}
              </div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">SSID</div>
              {detail.mc_ssid && detail.mc_ssid !== "false" ? (
                <div className="db-detail-stat-value-wrapper">
                  <span className="db-detail-stat-value" style={{ wordBreak: "break-all", whiteSpace: "normal" }}>{detail.mc_ssid}</span>
                  <CopyButton text={detail.mc_ssid} />
                </div>
              ) : (
                <div className="db-detail-stat-value-wrapper">
                  <span className="db-detail-stat-value" style={{ color: "var(--muted-foreground)", opacity: 0.6, fontStyle: "italic" }}>None</span>
                </div>
              )}
            </div>
          </div>
          <hr className="border-t border-border/30" />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button onClick={() => setShowMail(true)} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.1rem", fontSize: "0.8rem", fontWeight: 600, borderRadius: "8px", border: "1px solid color-mix(in oklab, var(--accent) 40%, transparent)", background: "color-mix(in oklab, var(--accent) 12%, transparent)", color: "var(--accent)", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "color-mix(in oklab, var(--accent) 22%, transparent)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "color-mix(in oklab, var(--accent) 12%, transparent)"; }}
            >
              <Mail className="h-3.5 w-3.5" />
              Access Mail
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1.25rem", flex: 1 }}>
        <div className="db-detail-section" style={{ flex: 1 }}>
          <div className="db-detail-section-title">Personal Info</div>
          <div className="db-detail-section-grid" style={{ flex: 1, alignContent: "flex-start" }}>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">First Name</div>
              <div className="db-detail-stat-value">{detail.ms_first_name || "—"}</div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Last Name</div>
              <div className="db-detail-stat-value">{detail.ms_last_name || "—"}</div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Full Name</div>
              <div className="db-detail-stat-value">{detail.ms_full_name || "—"}</div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Birthday</div>
              <div className="db-detail-stat-value">{detail.ms_birthday || "—"}</div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Region</div>
              <div className="db-detail-stat-value">{detail.ms_region || "—"}</div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Language</div>
              <div className="db-detail-stat-value">{detail.ms_language || "—"}</div>
            </div>
          </div>
        </div>
        <div className="db-detail-section" style={{ flex: 1 }}>
          <div className="db-detail-section-title">Subscriptions &amp; Devices</div>
          <div className="db-detail-section-grid" style={{ flex: 1, alignContent: "flex-start" }}>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Active Subscriptions</div>
              <div className="db-detail-stat-value">{fmtList(detail.ms_subscriptions_active, "No active subscriptions")}</div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Canceled Subscriptions</div>
              <div className="db-detail-stat-value">{fmtList(detail.ms_subscriptions_canceled, "No canceled subscriptions")}</div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Commercial Subscriptions</div>
              <div className="db-detail-stat-value">{fmtList(detail.ms_subscriptions_commercial, "No commercial subscriptions")}</div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Devices</div>
              <div className="db-detail-stat-value">{fmtList(detail.ms_devices, "No devices")}</div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Cards</div>
              <div className="db-detail-stat-value">{fmtList(detail.ms_cards, "No cards")}</div>
            </div>
            <div className="db-detail-stat-block">
              <div className="db-detail-stat-label">Family</div>
              <div className="db-detail-stat-value">{fmtList(detail.ms_family, "No family")}</div>
            </div>
          </div>
        </div>
      </div>

      {showMail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={() => { setShowMail(false); setSelectedMsg(null); }}>
          <div className="flex h-[80vh] w-[90vw] max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl backdrop-blur" onClick={e => e.stopPropagation()}>
            <div className="flex w-80 shrink-0 flex-col border-r border-border">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold truncate">{detail.ms_security_email}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => { fetch("/api/emails", { headers: authHeaders() }).then(r => r.json()).then(setEmails).catch(() => {}); }} className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground" title="Refresh">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => { setShowMail(false); setSelectedMsg(null); }} className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 divide-y divide-border/50 overflow-y-auto">
                {matchedEmail && matchedEmail.inbox.length > 0 ? (
                  matchedEmail.inbox.map(msg => (
                    <button
                      key={msg.id}
                      onClick={() => setSelectedMsg(msg)}
                      className={`w-full px-4 py-3 text-left transition hover:bg-background/40 ${selectedMsg?.id === msg.id ? "bg-[--primary]/10" : ""}`}
                    >
                      <p className="truncate text-sm font-medium">{msg.subject || "(no subject)"}</p>
                      <p className="truncate text-xs text-muted-foreground">{msg.from_address}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground/60">{msg.body?.slice(0, 80)}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground/40">{msg.received_at?.slice(0, 16).replace("T", " ")}</p>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-8 text-center text-sm text-muted-foreground">{matchedEmail ? "No messages." : "No managed inbox for this email."}</p>
                )}
              </div>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">
              {selectedMsg ? (
                <div className="flex flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display text-xl font-bold">{selectedMsg.subject || "(no subject)"}</h2>
                    <span className="shrink-0 text-xs text-muted-foreground">{selectedMsg.received_at?.slice(0, 16).replace("T", " ")}</span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">From: <span className="text-foreground">{selectedMsg.from_address}</span></p>
                  <p className="mt-1 text-sm text-muted-foreground">To: <span className="text-foreground">{selectedMsg.to_address}</span></p>
                  <div className="mt-6 whitespace-pre-wrap rounded-xl border border-border bg-background/40 p-5 text-sm leading-relaxed">{selectedMsg.body}</div>
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <div className="text-center">
                    <Mail className="mx-auto h-12 w-12 text-muted-foreground/30" />
                    <p className="mt-3 text-sm text-muted-foreground">Select a message to read</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type EmailEntry = {
  email: string;
  inbox_count: number;
  inbox: EmailMessage[];
};

type EmailMessage = {
  id: number;
  to_address: string;
  from_address: string;
  subject: string;
  body: string;
  received_at: string;
};

function EmailsPanel() {
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [creating, setCreating] = useState(false);
  const [modalEmail, setModalEmail] = useState<string | null>(null);
  const [selectedMsg, setSelectedMsg] = useState<EmailMessage | null>(null);
  const [domain, setDomain] = useState("example.com");
  const [refreshing, setRefreshing] = useState(false);
  const knownIds = useRef<Set<number>>(
    new Set(JSON.parse(localStorage.getItem("known-email-ids") || "[]"))
  );
  const { addNotification } = useContext(NotificationContext);

  function playNotificationSound() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
      setTimeout(() => ctx.close(), 500);
    } catch {}
  }

  const load = () => {
    const start = Date.now();
    setRefreshing(true);
    const done = () => {
      const elapsed = Date.now() - start;
      if (elapsed < 1500) setTimeout(() => setRefreshing(false), 1500 - elapsed);
      else setRefreshing(false);
    };
    return Promise.all([
      fetch("/api/emails", { headers: authHeaders() }).then(r => r.json()),
      fetch("/api/config", { headers: authHeaders() }).then(r => r.json()),
    ]).then(([e, c]) => {
      const current = new Set<number>();
      const newMessages: { email: string; subject: string }[] = [];
      for (const entry of e as EmailEntry[]) {
        for (const msg of entry.inbox) {
          current.add(msg.id);
          if (!knownIds.current.has(msg.id)) {
            newMessages.push({ email: entry.email, subject: msg.subject });
          }
        }
      }
      if (newMessages.length > 0) {
        playNotificationSound();
        for (const nm of newMessages) {
          addNotification(`New email at ${nm.email}`, nm.subject || "(no subject)");
        }
      }
      knownIds.current = current;
      localStorage.setItem("known-email-ids", JSON.stringify([...current]));
      setEmails(e);
      setDomain(c.domain);
    }).finally(done);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const filtered = emails.filter(e =>
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail || !newPass) return;
    setCreating(true);
    await fetch("/api/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ email: newEmail, password: newPass }),
    });
    setNewEmail("");
    setNewPass("");
    setShowForm(false);
    setCreating(false);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Emails</h1>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {emails.length} email{emails.length !== 1 ? "s" : ""} in database
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-[--primary] to-[--accent] px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_25px_-8px_color-mix(in_oklab,var(--primary)_40%,transparent)] transition hover:opacity-95"
        >
          {showForm ? null : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Create"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="text" required value={newEmail} onChange={e => setNewEmail(e.target.value)}
                placeholder={`user@${domain}`}
                className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="text" required value={newPass} onChange={e => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30"
              />
            </div>
          </div>
          <button
            type="submit" disabled={creating}
            className="w-full inline-flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[--primary] to-[--accent] px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-[0_0_25px_-8px_color-mix(in_oklab,var(--primary)_40%,transparent)] transition hover:opacity-95 disabled:opacity-60"
          >
            {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
            {creating ? "Creating…" : "Add Email"}
          </button>
        </form>
      )}

      <div className="flex gap-3 items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search emails..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card/60 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30"
          />
        </div>
        <button onClick={() => { load(); }} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-card/60 text-muted-foreground transition hover:text-foreground" title="Refresh">
          {refreshing ? <Loader2 className="h-4 w-4 animate-spin animation-duration-3000" /> : <RotateCcw className="h-4 w-4" />}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card/40 px-6 py-20 backdrop-blur">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full border-2 border-[--accent]/60 text-[--accent]">
              <Inbox className="h-9 w-9" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold">No emails yet</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Create an email address to start receiving messages.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filtered.map((e, i) => (
              <button
                key={e.email}
                onClick={() => { setModalEmail(e.email); const msgs = e.inbox; setSelectedMsg(msgs[msgs.length - 1] ?? null); }}
                className="animate-in fade-in slide-in-from-left-2 duration-400 flex w-full items-center gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur px-5 py-4 text-left transition hover:bg-background/30"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[--primary]/20 to-[--accent]/10 text-[--accent]">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{e.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.inbox_count} message{e.inbox_count !== 1 ? "s" : ""}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>

          {modalEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => { setModalEmail(null); setSelectedMsg(null); }}>
            <div className="flex h-[80vh] w-[90vw] max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl backdrop-blur animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="flex w-80 shrink-0 flex-col border-r border-border">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <p className="text-sm font-semibold truncate">{modalEmail}</p>
                  <button onClick={() => { setModalEmail(null); setSelectedMsg(null); }} className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 divide-y divide-border/50 overflow-y-auto">
                  {(emails.find(e => e.email === modalEmail)?.inbox ?? []).length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-muted-foreground">No messages.</p>
                  ) : (
                    emails.find(e => e.email === modalEmail)?.inbox.slice().reverse().map(msg => (
                      <button
                        key={msg.id}
                        onClick={() => setSelectedMsg(msg)}
                        className={`w-full px-4 py-3 text-left transition hover:bg-background/40 ${selectedMsg?.id === msg.id ? "bg-[--primary]/10" : ""}`}
                      >
                        <p className="truncate text-sm font-medium">{msg.subject || "(no subject)"}</p>
                        <p className="truncate text-xs text-muted-foreground">{msg.from_address}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground/60">{msg.body?.slice(0, 80)}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground/40">{msg.received_at?.slice(0, 16).replace("T", " ")}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col overflow-y-auto">
                {selectedMsg ? (
                  <div className="flex flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="font-display text-xl font-bold">{selectedMsg.subject || "(no subject)"}</h2>
                      <span className="shrink-0 text-xs text-muted-foreground">{selectedMsg.received_at?.slice(0, 16).replace("T", " ")}</span>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">From: <span className="text-foreground">{selectedMsg.from_address}</span></p>
                    <p className="mt-1 text-sm text-muted-foreground">To: <span className="text-foreground">{selectedMsg.to_address}</span></p>
                    <div className="mt-6 whitespace-pre-wrap rounded-xl border border-border bg-background/40 p-5 text-sm leading-relaxed">{selectedMsg.body}</div>
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-center">
                    <div className="text-center">
                      <Mail className="mx-auto h-12 w-12 text-muted-foreground/30" />
                      <p className="mt-3 text-sm text-muted-foreground">Select a message to read</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    )}
    </div>
  );
}

type Method = "recovery" | "recovery-bulk" | "password" | "password-bulk";

const methods: {
  id: Method;
  title: string;
  description: string;
  icon: typeof KeyRound;
  bulk: boolean;
  needs2FA?: boolean;
}[] = [
  { id: "recovery", title: "Recovery Code", description: "Use your email and recovery code", icon: KeyRound, bulk: false },
  { id: "password", title: "Password + Secret", description: "Use your email, password and authenticator secret", icon: Fingerprint, bulk: false, needs2FA: true },
  { id: "recovery-bulk", title: "Recovery Code Bulk", description: "Secures multiple accounts via recovery code", icon: Layers, bulk: true },
  { id: "password-bulk", title: "Password + Secret Bulk", description: "Secure multiple accounts via pwd and secret", icon: FileKey, bulk: true, needs2FA: true },
];

function Secure() {
  const [selected, setSelected] = useState<Method | null>(null);
  const current = methods.find((m) => m.id === selected);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Secure Accounts</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose how you want to authenticate and secure your accounts.</p>
      </div>

      {!current ? (
        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
          <h2 className="font-display text-lg font-semibold">Select Securing Method</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose how you want to secure your account:</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {methods.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                className="animate-in fade-in slide-in-from-bottom-3 duration-400 group relative flex items-start gap-4 rounded-xl border border-border bg-background/40 p-4 text-left transition hover:border-[--accent]/50 hover:bg-card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[--primary]/20 to-[--accent]/10 text-[--accent]">
                  <m.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{m.title}</p>
                    {m.needs2FA && (
                      <span className="rounded-full bg-[--primary]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[--primary]">Needs 2FA</span>
                    )}
                    {m.bulk && (
                      <span className="rounded-full bg-[--accent]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[--accent]">Bulk</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 self-center text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[--accent]" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <SecureForm method={current} onBack={() => setSelected(null)} />
      )}
    </div>
  );
}

function SecureForm({ method, onBack }: { method: (typeof methods)[number]; onBack: () => void }) {
  const { addNotification } = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [bulk, setBulk] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const body: Record<string, unknown> = {};
    if (method.bulk) {
      body.entries = bulk.split("\n").map(l => l.trim()).filter(Boolean);
    } else {
      body.email = email;
      if (method.id === "recovery") body.recovery_code = secret;
      if (method.id === "password") { body.password = password; body.totp_secret = totp; }
    }
    const res = await fetch(`/api/secure/${method.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      setResult({ ok: true, message: `Secured successfully${data.mc_name ? ` — ${data.mc_name}` : ""}.` });
      addNotification(`Account secured${data.mc_name ? ` — ${data.mc_name}` : ""}`, email || `${body.entries?.length || 0} entries`);
    } else {
      setResult({ ok: false, message: (await res.text()) || "Failed." });
    }
    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to methods
      </button>

      <div className="mt-4 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-[--primary]/20 to-[--accent]/10 text-[--accent]">
          <method.icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">{method.title}</h2>
          <p className="text-sm text-muted-foreground">{method.description}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {method.bulk ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Entries{" "}
              <span className="text-muted-foreground">
                ({method.id === "recovery-bulk" ? "email:recovery_code" : "email:password:totp_secret"} per line)
              </span>
            </label>
            <textarea
              value={bulk}
              onChange={e => setBulk(e.target.value)}
              rows={8}
              placeholder={method.id === "recovery-bulk" ? "alex@example.com:ABCD-EFGH-IJKL" : "alex@example.com:password123:JBSWY3DPEHPK3PXP"}
              className="w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 font-mono text-xs outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30"
              required
            />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30" required />
            </div>
            {method.id === "recovery" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Recovery Code</label>
                <input type="text" value={secret} onChange={e => setSecret(e.target.value)} placeholder="ABCD-EFGH-IJKL-MNOP" className="w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 font-mono text-sm outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30" required />
              </div>
            )}
            {method.id === "password" && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Authenticator Secret (TOTP)</label>
                  <input type="text" value={totp} onChange={e => setTotp(e.target.value)} placeholder="JBSWY3DPEHPK3PXP" className="w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 font-mono text-sm outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30" required />
                </div>
              </>
            )}
          </>
        )}

        {result && (
          <div className={`rounded-lg border px-4 py-3 text-sm ${result.ok ? "border-[--accent]/40 bg-[--accent]/10 text-[--accent]" : "border-destructive/40 bg-destructive/10 text-destructive-foreground"}`}>
            {result.message}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onBack} className="rounded-lg border border-border bg-background/60 px-5 py-2.5 text-sm font-medium transition hover:bg-card">Cancel</button>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[--primary] to-[--accent] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-95 disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {loading ? "Securing…" : "Secure"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─── Settings sub-components ─────────────────────────────────────────────── */

function ThemeCard({ preset, selected, onClick }: { preset: ThemePreset; selected: boolean; onClick: () => void }) {
  const { primary, accent } = previewColors(preset.primaryHue, preset.accentHue, preset.saturation);
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border-2 bg-card/80 transition-all duration-200 hover:scale-[1.03]",
        selected ? "border-[--primary] shadow-[0_0_12px_-2px_color-mix(in_srgb,var(--primary)_40%,transparent)]"
                 : "border-border hover:border-muted-foreground/50"
      )}
    >
      <div className="relative h-[72px] w-full bg-background/50">
        <div
          className="absolute bottom-2.5 left-2.5 h-0.5 w-1/2 rounded-full opacity-90"
          style={{ background: `linear-gradient(90deg, ${primary}, ${accent})` }}
        />
        {selected && (
          <div
            className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full"
            style={{ background: primary }}
          >
            <Check className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
      <p className="py-1.5 text-center text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition">
        {preset.name}
      </p>
    </button>
  );
}

const ANIMATIONS: { id: AnimationType; label: string; desc: string; icon: typeof Star }[] = [
  { id: "starfield", label: "Starfield",  desc: "Twinkling stars & drifting clouds", icon: Star },
  { id: "aurora",    label: "Aurora",     desc: "Northern lights shimmer",           icon: Sparkles },
  { id: "particles", label: "Particles",  desc: "Floating particles rising",         icon: Zap },
  { id: "rain",      label: "Rain",       desc: "Gentle digital rain",               icon: CloudRain },
  { id: "waves",     label: "Waves",      desc: "Slow undulating waves",             icon: Waves },
  { id: "none",      label: "None",       desc: "Clean, no animation",               icon: Monitor },
];

const INTERFACE_FONTS: InterfaceFont[] = [
  "Inter", "Manrope", "Poppins", "Space Grotesk", "Outfit",
  "Sora", "Plus Jakarta Sans", "DM Sans", "Figtree", "system-ui", "serif",
];
const INTERFACE_FONT_LABELS: Record<string, string> = { "system-ui": "System", "serif": "Serif" };

const MONO_FONTS: MonoFont[] = [
  "JetBrains Mono", "Fira Code", "IBM Plex Mono", "Roboto Mono", "Source Code Pro", "monospace",
];
const MONO_FONT_LABELS: Record<string, string> = { "monospace": "System Mono" };

function RangeSlider({
  label, value, min, max, unit = "", trackStyle, onChange,
}: {
  label: string; value: number; min: number; max: number;
  unit?: string; trackStyle?: React.CSSProperties; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-semibold text-[--primary]">{value}{unit}</span>
      </div>
      <div className="relative h-2 rounded-full" style={trackStyle ?? { background: "var(--muted)" }}>
        <input
          type="range"
          min={min} max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="custom-range absolute inset-0 h-full w-full cursor-pointer opacity-0"
          style={{ zIndex: 2 }}
        />
        <div
          className="pointer-events-none absolute left-0 top-0 h-full rounded-full bg-[--primary]/70"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[--primary] bg-white shadow"
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 8px)`, zIndex: 1 }}
        />
      </div>
    </div>
  );
}

function ThemePreview({ s }: { s: ThemeSettings }) {
  const { primary, accent } = previewColors(s.primaryHue, s.accentHue, s.saturation);
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-border bg-background/60 p-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full" style={{ background: primary }} />
        <div className="space-y-1 flex-1">
          <div className="h-2 rounded-full" style={{ background: primary, width: "70%" }} />
          <div className="h-1.5 rounded-full bg-muted-foreground/30 w-full" />
          <div className="h-1.5 rounded-full bg-muted-foreground/20 w-4/5" />
        </div>
      </div>
      <div className="flex-1 space-y-2 rounded-lg border border-border/60 bg-card/40 p-3">
        <div className="h-1.5 rounded-full bg-muted-foreground/30 w-full" />
        <div className="h-1.5 rounded-full bg-muted-foreground/20 w-3/4" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-5 rounded-full" style={{ background: primary }} />
        <div className="h-5 w-5 rounded-full" style={{ background: accent }} />
        <div className="h-5 w-5 rounded-full bg-muted" />
        <div className="h-5 w-5 rounded-full bg-foreground/80" />
      </div>
    </div>
  );
}

/* ─── Main SettingsPanel ───────────────────────────────────────────────────── */

function SettingsPanel() {
  const [s, setS] = useState<ThemeSettings>(() => loadSettings());
  const [username, setUsername]     = useState("admin");
  const [pwCurrent, setPwCurrent]   = useState("");
  const [pwNew, setPwNew]           = useState("");
  const [pwConfirm, setPwConfirm]   = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [pwStatus, setPwStatus]     = useState<{ ok: boolean; msg: string } | null>(null);
  const [pwLoading, setPwLoading]   = useState(false);
  const [totpSecret, setTotpSecret] = useState("");
  const [totpStatus, setTotpStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [totpLoading, setTotpLoading] = useState(false);

  useEffect(() => {
    fetch("/api/me", { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setUsername(d.username || "admin"));
  }, []);

  const update = (patch: Partial<ThemeSettings>) => {
    const next = { ...s, ...patch };
    setS(next);
    saveSettings(next);
  };

  const applyPreset = (p: ThemePreset) =>
    update({ themeId: p.id, primaryHue: p.primaryHue, accentHue: p.accentHue, saturation: p.saturation, bgLightness: p.bgLightness });

  const reset = () => { const d = { ...DEFAULT_SETTINGS }; setS(d); saveSettings(d); };

  const rainbowTrack = { background: "linear-gradient(to right, hsl(0,80%,55%), hsl(45,80%,55%), hsl(90,80%,55%), hsl(135,80%,55%), hsl(180,80%,55%), hsl(225,80%,55%), hsl(270,80%,55%), hsl(315,80%,55%), hsl(360,80%,55%))" };

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwNew !== pwConfirm) { setPwStatus({ ok: false, msg: "Passwords don't match." }); return; }
    setPwLoading(true); setPwStatus(null);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ current_password: pwCurrent, new_password: pwNew }),
    });
    setPwStatus(res.ok ? { ok: true, msg: "Password updated." } : { ok: false, msg: (await res.text()) || "Failed." });
    if (res.ok) { setPwCurrent(""); setPwNew(""); setPwConfirm(""); }
    setPwLoading(false);
  }

  async function saveTotpSecret(e: React.FormEvent) {
    e.preventDefault();
    setTotpLoading(true); setTotpStatus(null);
    const res = await fetch("/api/auth/setup-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ secret: totpSecret }),
    });
    setTotpStatus(res.ok ? { ok: true, msg: "2FA secret saved." } : { ok: false, msg: (await res.text()) || "Failed." });
    setTotpLoading(false);
  }

  return (
    <div className="space-y-10 pb-10">

      {/* ── Appearance ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Appearance</h1>
          <p className="mt-1 text-sm text-muted-foreground">Customize your theme colors.</p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      {/* Preset themes */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-[--primary]" />
          <h2 className="font-display text-lg font-semibold">Preset Themes</h2>
        </div>
        <p className="text-sm text-muted-foreground">Pick a vibe, then tweak it to make it yours.</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {THEME_PRESETS.map(p => (
            <ThemeCard key={p.id} preset={p} selected={s.themeId === p.id} onClick={() => applyPreset(p)} />
          ))}
        </div>
      </section>

      {/* Animation + Preview */}
      <section className="space-y-4">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Animation list */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[--primary]" />
              <h2 className="font-display text-lg font-semibold">Animation</h2>
            </div>
            <p className="text-sm text-muted-foreground">Background mood.</p>
            <div className="space-y-2">
              {ANIMATIONS.map(a => {
                const active = s.animation === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => update({ animation: a.id })}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition",
                      active
                        ? "border-[--primary]/60 bg-[--primary]/10"
                        : "border-border bg-card/40 hover:border-border/80 hover:bg-card/60"
                    )}
                  >
                    <div className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                      active ? "bg-gradient-to-br from-[--primary]/30 to-[--accent]/20 text-[--primary]" : "bg-muted text-muted-foreground"
                    )}>
                      <a.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{a.label}</p>
                      <p className="text-xs text-muted-foreground">{a.desc}</p>
                    </div>
                    {active && <Check className="h-4 w-4 shrink-0 text-[--primary]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-[--primary]" />
              <h2 className="font-display text-lg font-semibold">Preview</h2>
            </div>
            <p className="text-sm text-muted-foreground">What it looks like.</p>
            <ThemePreview s={s} />
          </div>
        </div>
      </section>

      {/* Fine-tune */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-[--primary]" />
          <h2 className="font-display text-lg font-semibold">Fine-tune</h2>
        </div>
        <p className="text-sm text-muted-foreground">Dial in the exact look you want.</p>
        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
          <div className="grid gap-6 sm:grid-cols-2">
            <RangeSlider
              label="Primary Color" value={s.primaryHue} min={0} max={359} unit="°"
              trackStyle={rainbowTrack}
              onChange={v => update({ primaryHue: v, themeId: "custom" })}
            />
            <RangeSlider
              label="Accent Color" value={s.accentHue} min={0} max={359} unit="°"
              trackStyle={rainbowTrack}
              onChange={v => update({ accentHue: v, themeId: "custom" })}
            />
            <RangeSlider
              label="Saturation" value={s.saturation} min={0} max={100} unit="%"
              trackStyle={{ background: `linear-gradient(to right, hsl(${s.primaryHue},0%,55%), hsl(${s.primaryHue},80%,55%))` }}
              onChange={v => update({ saturation: v, themeId: "custom" })}
            />
            <RangeSlider
              label="Background" value={s.bgLightness} min={2} max={30} unit="%"
              trackStyle={{ background: "linear-gradient(to right, #000, #334)" }}
              onChange={v => update({ bgLightness: v, themeId: "custom" })}
            />
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Type className="h-5 w-5 text-[--primary]" />
          <h2 className="font-display text-lg font-semibold">Typography</h2>
        </div>
        <p className="text-sm text-muted-foreground">Choose your interface and monospace fonts, and the overall text size.</p>
        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Interface font</p>
            <div className="flex flex-wrap gap-2">
              {INTERFACE_FONTS.map(f => (
                <button
                  key={f}
                  onClick={() => update({ interfaceFont: f })}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm transition",
                    s.interfaceFont === f
                      ? "border-[--primary] bg-[--primary]/15 text-foreground"
                      : "border-border bg-card/40 text-muted-foreground hover:border-border/80 hover:text-foreground"
                  )}
                  style={{ fontFamily: f === "system-ui" ? "system-ui" : f === "serif" ? "Georgia,serif" : `"${f}",sans-serif` }}
                >
                  {INTERFACE_FONT_LABELS[f] ?? f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Monospace font</p>
            <div className="flex flex-wrap gap-2">
              {MONO_FONTS.map(f => (
                <button
                  key={f}
                  onClick={() => update({ monoFont: f })}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm transition",
                    s.monoFont === f
                      ? "border-[--primary] bg-[--primary]/15 text-foreground"
                      : "border-border bg-card/40 text-muted-foreground hover:border-border/80 hover:text-foreground"
                  )}
                  style={{ fontFamily: f === "monospace" ? "monospace" : `"${f}",monospace` }}
                >
                  {MONO_FONT_LABELS[f] ?? f}
                </button>
              ))}
            </div>
          </div>

          <RangeSlider
            label="Text size" value={s.textSize} min={75} max={130} unit="%"
            onChange={v => update({ textSize: v })}
          />
        </div>
      </section>

      {/* ── Security ────────────────────────────────────────────────────────── */}
      <div className="pt-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[--primary]" />
          <h1 className="font-display text-2xl font-bold tracking-tight">Security</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account credentials and authentication.</p>
      </div>

      {/* Profile */}
      <div className="space-y-5 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
        <h2 className="font-display text-base font-semibold text-muted-foreground uppercase tracking-wider text-xs">Profile</h2>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            readOnly
            className="w-full max-w-sm rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm outline-none text-muted-foreground"
          />
        </div>
      </div>

      {/* Change password */}
      <div className="space-y-5 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
        <h2 className="font-display text-base font-semibold text-muted-foreground uppercase tracking-wider text-xs">Change Password</h2>
        <form onSubmit={changePassword} className="max-w-sm space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Current Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={pwCurrent}
                onChange={e => setPwCurrent(e.target.value)}
                className="w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30"
                required
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">New Password</label>
            <input
              type={showPw ? "text" : "password"}
              value={pwNew}
              onChange={e => setPwNew(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Confirm New Password</label>
            <input
              type={showPw ? "text" : "password"}
              value={pwConfirm}
              onChange={e => setPwConfirm(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30"
              required
            />
          </div>
          {pwStatus && (
            <div className={cn("rounded-lg border px-4 py-3 text-sm", pwStatus.ok
              ? "border-[--accent]/40 bg-[--accent]/10 text-[--accent]"
              : "border-destructive/40 bg-destructive/10 text-red-400"
            )}>
              {pwStatus.msg}
            </div>
          )}
          <button
            type="submit"
            disabled={pwLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[--primary] to-[--accent] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-95 disabled:opacity-60"
          >
            {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            {pwLoading ? "Saving…" : "Update Password"}
          </button>
        </form>
      </div>

      {/* 2FA */}
      <div className="space-y-5 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
        <h2 className="font-display text-base font-semibold text-muted-foreground uppercase tracking-wider text-xs">Two-Factor Authentication</h2>
        <p className="text-sm text-muted-foreground">
          Store your TOTP secret here to enable 2FA for dashboard login. Use an authenticator app (Google Authenticator, Authy) to scan the secret.
        </p>
        <form onSubmit={saveTotpSecret} className="max-w-sm space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">TOTP Secret</label>
            <input
              type="text"
              value={totpSecret}
              onChange={e => setTotpSecret(e.target.value)}
              placeholder="JBSWY3DPEHPK3PXP"
              className="w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 font-mono text-sm outline-none transition focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/30"
            />
          </div>
          {totpStatus && (
            <div className={cn("rounded-lg border px-4 py-3 text-sm", totpStatus.ok
              ? "border-[--accent]/40 bg-[--accent]/10 text-[--accent]"
              : "border-destructive/40 bg-destructive/10 text-red-400"
            )}>
              {totpStatus.msg}
            </div>
          )}
          <button
            type="submit"
            disabled={totpLoading || !totpSecret}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[--primary] to-[--accent] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-95 disabled:opacity-60"
          >
            {totpLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            {totpLoading ? "Saving…" : "Save 2FA Secret"}
          </button>
        </form>
      </div>

    </div>
  );
}
