"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const metrics = [
  { value: "190+", label: "economies tracked" },
  { value: "60 yrs", label: "of historical data" },
  { value: "1 source", label: "consistent methodology" },
];

const features = [
  { n: "01", title: "Global overview", copy: "See the shape of the world economy at a glance, with the signal separated from the noise." },
  { n: "02", title: "Country histories", copy: "Move from the latest GDP observation to decades of context in a single interaction." },
  { n: "03", title: "Regional comparison", copy: "Filter economies by continent and compare scale, rank, and contribution consistently." },
];

export default function Hero() {
  return (
    <main className="overflow-hidden bg-[#070b14]">
      <section className="relative min-h-[92vh] border-b border-white/[0.06] pt-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="absolute left-[10%] top-28 h-80 w-80 rounded-full bg-blue-600/15 blur-[110px]" />
        <div className="absolute right-[8%] top-48 h-72 w-72 rounded-full bg-cyan-400/10 blur-[110px]" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-20 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:pb-28 lg:pt-28">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-1.5 text-xs font-medium text-cyan-200">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              World Bank data, made explorable
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
              Understand the world through its <span className="bg-gradient-to-r from-blue-400 to-cyan-200 bg-clip-text text-transparent">economies.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              A focused workspace for exploring GDP, comparing countries, and turning decades of global data into useful context.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-cyan-100">
                Explore the dashboard
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </Link>
              <Link href="/countries" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-medium text-slate-200 hover:border-white/20 hover:bg-white/[0.06]">Browse countries</Link>
            </div>
            <div className="mt-12 grid max-w-xl grid-cols-3 border-t border-white/[0.07] pt-6">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <p className="text-lg font-semibold text-white sm:text-xl">{metric.value}</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500 sm:text-xs">{metric.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: .96, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: .7, delay: .12 }} className="relative">
            <div className="absolute -inset-8 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1320]/90 p-4 shadow-2xl shadow-black/50 backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-2 pb-4">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-300" /><span className="text-xs text-slate-400">Global GDP overview</span></div>
                <span className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-slate-500">Latest data</span>
              </div>
              <div className="grid grid-cols-2 gap-3 py-4">
                <div className="rounded-2xl bg-white/[0.035] p-4"><p className="text-xs text-slate-500">Coverage</p><p className="mt-2 text-2xl font-semibold text-white">Worldwide</p><p className="mt-1 text-xs text-emerald-300">● Database connected</p></div>
                <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-300/5 p-4"><p className="text-xs text-slate-400">Primary indicator</p><p className="mt-2 text-2xl font-semibold text-white">GDP</p><p className="mt-1 text-xs text-cyan-200">Current US$</p></div>
              </div>
              <div className="rounded-2xl border border-white/[0.05] bg-[#090e18] p-5">
                <div className="mb-6 flex items-center justify-between"><div><p className="text-xs text-slate-500">Economic activity</p><p className="mt-1 text-lg font-semibold text-white">Long-term expansion</p></div><span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300">+2.7%</span></div>
                <div className="flex h-36 items-end gap-2">
                  {[26, 31, 29, 39, 45, 42, 53, 58, 66, 62, 76, 88].map((height, index) => <motion.div key={index} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: .45 + index * .035 }} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600/35 to-cyan-300/80" />)}
                </div>
                <div className="mt-3 flex justify-between text-[10px] text-slate-600"><span>2013</span><span>2016</span><span>2019</span><span>2024</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="overview" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-blue-400">Built for clarity</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">From a big dataset to a clear point of view.</h2><p className="mt-5 text-sm leading-7 text-slate-500">Explore without spreadsheets, inconsistent labels, or disconnected charts.</p></div>
          <div id="features" className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {features.map((feature) => <motion.div key={feature.n} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr_1.2fr] sm:items-start"><span className="text-xs text-cyan-300">{feature.n}</span><h3 className="font-medium text-white">{feature.title}</h3><p className="text-sm leading-6 text-slate-500">{feature.copy}</p></motion.div>)}
          </div>
        </div>
      </section>
    </main>
  );
}
