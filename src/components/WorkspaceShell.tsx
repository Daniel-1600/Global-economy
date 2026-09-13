"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

const nav = [
  { label: "Overview", href: "/dashboard", icon: "grid" },
  { label: "Countries", href: "/countries", icon: "globe" },
  { label: "Data lab", href: "/countryData", icon: "chart" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></>,
    chart: <><path d="M4 19V9m6 10V5m6 14v-7m4 7H2"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21h-4v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3v-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 001.9.3 1.7 1.7 0 001-1.5V3h4v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.5 1h.1v4h-.1a1.7 1.7 0 00-1.5 1Z"/></>,
  };
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{paths[name]}</svg>;
}

export default function WorkspaceShell({ title, eyebrow, actions, children }: { title: string; eyebrow?: string; actions?: ReactNode; children: ReactNode }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.06] bg-[#090e18] md:flex md:flex-col">
        <Link href="/" className="flex h-20 items-center gap-3 border-b border-white/[0.06] px-6"><span className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-300/20 bg-blue-500/10 text-xs font-bold text-cyan-200">GE</span><span><strong className="block text-sm text-white">Global Economy</strong><small className="text-[10px] uppercase tracking-[.18em] text-slate-600">Intelligence</small></span></Link>
        <nav className="flex-1 space-y-1 p-4">
          <p className="px-3 pb-3 pt-2 text-[10px] font-semibold uppercase tracking-[.2em] text-slate-700">Workspace</p>
          {nav.map((item) => { const active = router.pathname === item.href; return <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${active ? "bg-blue-500/10 text-blue-300" : "text-slate-500 hover:bg-white/[0.035] hover:text-slate-200"}`}><Icon name={item.icon}/>{item.label}{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300"/>}</Link>; })}
        </nav>
        <div className="m-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-xs font-semibold text-white">EX</span><div><p className="text-xs font-medium text-white">Explorer</p><p className="text-[11px] text-slate-600">Research workspace</p></div></div></div>
      </aside>
      <div className="md:ml-64">
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#070b14]/85 backdrop-blur-xl">
          <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8"><div>{eyebrow && <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-blue-400">{eyebrow}</p>}<h1 className="mt-1 text-lg font-semibold text-white">{title}</h1></div>{actions}</div>
          <nav className="flex gap-1 overflow-x-auto px-4 pb-3 md:hidden">{nav.map((item) => <Link key={item.href} href={item.href} className={`shrink-0 rounded-full px-3 py-2 text-xs ${router.pathname === item.href ? "bg-blue-500/15 text-blue-300" : "text-slate-500"}`}>{item.label}</Link>)}</nav>
        </header>
        <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
