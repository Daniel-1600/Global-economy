"use client";

import WorkspaceShell from "@/components/WorkspaceShell";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface EconomyItem { year: number; countryCode: string; gdp: number; country: { name: string } }
interface Summary { continent: string; continentCode: string; totalGDP: number; countryCount: number; topCountry: { name: string } }
interface EconomyResponse { success: boolean; count: number; data: EconomyItem[]; continentSummaries?: Summary[]; metadata?: { lastUpdated?: string; source?: string } }

const aggregateCodes = new Set(["WLD","HIC","OED","IBT","LMY","MIC","IBD","ECS","EAS","LCN","NAC","EMU","EUU","SSF","SSA","SAS","MEA","LAC","ARB","CEB","LIC","LMC","UMC","AFE","AFW"]);
const chartHeights = [36, 41, 39, 48, 54, 51, 62, 67, 64, 75, 81, 89];

const money = (value: number) => value >= 1e12 ? `$${(value / 1e12).toFixed(1)}T` : value >= 1e9 ? `$${(value / 1e9).toFixed(1)}B` : `$${value.toLocaleString()}`;

export default function Dashboard() {
  const [response, setResponse] = useState<EconomyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/economy`);
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body.message || "Could not load economy data");
      setResponse(body);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not load economy data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const overview = useMemo(() => {
    const data = response?.data || [];
    const year = data.length ? Math.max(...data.map((item) => item.year)) : 0;
    const current = data.filter((item) => item.year === year && !aggregateCodes.has(item.countryCode));
    const previous = data.filter((item) => item.year === year - 1 && !aggregateCodes.has(item.countryCode));
    const total = current.reduce((sum, item) => sum + item.gdp, 0);
    const previousTotal = previous.reduce((sum, item) => sum + item.gdp, 0);
    const growth = previousTotal ? ((total - previousTotal) / previousTotal) * 100 : 0;
    return { year, total, growth, countries: current.length, top: [...current].sort((a, b) => b.gdp - a.gdp).slice(0, 5) };
  }, [response]);

  return (
    <WorkspaceShell title="Global overview" eyebrow="Economic intelligence" actions={<div className="flex items-center gap-2 text-xs text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-400" />{response?.metadata?.source || "PostgreSQL"}</div>}>
      <section className="relative mb-6 overflow-hidden rounded-[2rem] border border-blue-400/15 bg-gradient-to-br from-[#15203a] via-[#101827] to-[#0d1320] p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-300">World economy · {overview.year || "Latest"}</p><h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">The global picture, without the clutter.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">Explore the latest stored GDP observations and move from global context to individual economies.</p></div>
          <Link href="/countries" className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-100 lg:self-auto">Explore countries <span>→</span></Link>
        </div>
      </section>

      {loading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0,1,2,3].map((x) => <div key={x} className="h-32 animate-pulse rounded-2xl bg-white/[0.035]" />)}</div> : error ? <div className="rounded-2xl border border-red-400/15 bg-red-400/[0.04] px-6 py-14 text-center"><p className="font-medium text-white">No dashboard data yet</p><p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">{error}</p><button onClick={load} className="mt-5 rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5">Try again</button></div> : <>
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Combined GDP", value: money(overview.total), note: `${overview.year} observation` },
            { label: "Economies tracked", value: overview.countries.toString(), note: "Countries & territories" },
            { label: "Annual movement", value: `${overview.growth >= 0 ? "+" : ""}${overview.growth.toFixed(1)}%`, note: `vs. ${overview.year - 1}` },
            { label: "Stored records", value: (response?.count || 0).toLocaleString(), note: "Historical observations" },
          ].map((stat, index) => <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }} className="rounded-2xl border border-white/[0.07] bg-[#0d1320] p-5"><div className="flex items-center justify-between"><p className="text-xs text-slate-500">{stat.label}</p><span className="text-[10px] text-slate-700">0{index + 1}</span></div><p className="mt-5 text-2xl font-semibold tracking-tight text-white">{stat.value}</p><p className="mt-2 text-xs text-slate-600">{stat.note}</p></motion.div>)}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.45fr_.85fr]">
          <div className="rounded-3xl border border-white/[0.07] bg-[#0d1320] p-5 sm:p-6">
            <div className="flex items-start justify-between"><div><p className="text-xs text-slate-500">GDP activity</p><h3 className="mt-1 font-semibold text-white">Twelve-year direction</h3></div><span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300">{overview.growth >= 0 ? "Expanding" : "Contracting"}</span></div>
            <div className="mt-8 flex h-52 items-end gap-2 sm:gap-3">{chartHeights.map((height, index) => <div key={index} className="group relative flex h-full flex-1 items-end"><motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: .2 + index * .035 }} className="w-full rounded-t-md bg-gradient-to-t from-blue-700/30 to-blue-400/80 group-hover:to-cyan-300" /></div>)}</div>
            <div className="mt-3 flex justify-between text-[10px] text-slate-700"><span>{overview.year - 11}</span><span>{overview.year - 8}</span><span>{overview.year - 5}</span><span>{overview.year}</span></div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0d1320]"><div className="flex items-center justify-between border-b border-white/[0.06] p-5"><div><p className="text-xs text-slate-500">Leading economies</p><h3 className="mt-1 font-semibold text-white">Top five by GDP</h3></div><Link href="/countries" className="text-xs text-blue-400 hover:text-cyan-300">View all</Link></div><div className="divide-y divide-white/[0.05]">{overview.top.map((country, index) => <button key={country.countryCode} className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.025]"><span className="w-5 text-xs text-slate-600">{index + 1}</span><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/10 text-[10px] font-bold text-blue-300">{country.countryCode}</span><span className="min-w-0 flex-1 truncate text-sm text-slate-300">{country.country.name}</span><span className="text-sm font-medium text-white">{money(country.gdp)}</span></button>)}</div></div>
        </section>
      </>}
    </WorkspaceShell>
  );
}
