"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const links = [
  { label: "Overview", href: "/#overview" },
  { label: "Countries", href: "/countries" },
  { label: "Data lab", href: "/countryData" },
];

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "border-b border-white/5 bg-[#070b14]/85 backdrop-blur-xl" : "bg-transparent"}`}>
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-blue-500/20 to-cyan-300/10 text-sm font-bold text-cyan-200 shadow-lg shadow-blue-950/40 transition-transform group-hover:-rotate-3">GE</span>
          <span className="text-sm font-semibold tracking-wide text-white">Global Economy</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.035] p-1 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white">{link.label}</Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-white">Sign in</Link>
          <button onClick={() => router.push("/dashboard")} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-100 hover:shadow-lg hover:shadow-cyan-300/10">Open dashboard</button>
        </div>

        <button type="button" aria-label="Toggle navigation" onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-300 md:hidden">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={open ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} /></svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mx-4 mb-4 rounded-2xl border border-white/10 bg-[#0d1320]/95 p-3 shadow-2xl backdrop-blur-xl md:hidden">
            {[...links, { label: "Dashboard", href: "/dashboard" }, { label: "Sign in", href: "/login" }].map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white">{link.label}</Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
