"use client";

import WorkspaceShell from "@/components/WorkspaceShell";
import { motion } from "framer-motion";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Point { date: string; value: number | null }
interface CountryResponse { gdpData: Point[]; popData: Point[] }

const formatGDP = (value: number) => value >= 1e12 ? `$${(value / 1e12).toFixed(1)}T` : `$${(value / 1e9).toFixed(1)}B`;
const formatPopulation = (value: number) => value >= 1e9 ? `${(value / 1e9).toFixed(2)}B` : `${(value / 1e6).toFixed(1)}M`;

function DataChart({ title, eyebrow, data, color, formatter }: { title: string; eyebrow: string; data: Point[]; color: string; formatter: (value: number) => string }) {
  const clean = data.filter((item): item is { date: string; value: number } => item.value !== null).slice(0, 20).reverse();
  return <section className="rounded-3xl border border-white/[0.07] bg-[#0d1320] p-5 sm:p-6"><div className="mb-7"><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-slate-600">{eyebrow}</p><h3 className="mt-2 font-semibold text-white">{title}</h3></div><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={clean}><defs><linearGradient id={`gradient-${eyebrow}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.35}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" vertical={false}/><XAxis dataKey="date" stroke="#455166" tickLine={false} axisLine={false} fontSize={11}/><YAxis stroke="#455166" tickLine={false} axisLine={false} fontSize={11} tickFormatter={formatter} width={60}/><Tooltip formatter={(value) => formatter(Number(value))} contentStyle={{ background: "#090e18", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, fontSize: 12 }}/><Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#gradient-${eyebrow})`} /></AreaChart></ResponsiveContainer></div></section>;
}

export default function CountryData() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<CountryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setError(""); setData(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/collect`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ countryCode: code }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Country data could not be loaded");
      setData(body);
    } catch (err) { setError(err instanceof Error ? err.message : "Country data could not be loaded"); }
    finally { setLoading(false); }
  };

  return <WorkspaceShell title="Country data lab" eyebrow="Deep dive">
    <section className="relative overflow-hidden rounded-[2rem] border border-blue-400/15 bg-gradient-to-br from-[#142039] to-[#0d1320] p-6 sm:p-9">
      <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="relative max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-300">Country lookup</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">Put one economy under the lens.</h2><p className="mt-3 text-sm leading-6 text-slate-400">Enter a three-letter country code to compare its GDP and population history.</p>
        <form onSubmit={search} className="mt-7 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><input value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))} maxLength={3} placeholder="e.g. KEN, USA, JPN" className="w-full rounded-xl border border-white/10 bg-[#080d17]/80 px-4 py-3.5 font-mono text-sm uppercase tracking-widest text-white outline-none placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-700 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10"/><span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-700">ISO 3</span></div><button disabled={loading || code.length !== 3} className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40">{loading ? "Loading…" : "Explore data"}</button></form>
        <div className="mt-4 flex flex-wrap gap-2">{["KEN","USA","CHN","IND","BRA"].map((item) => <button key={item} onClick={() => setCode(item)} className="rounded-lg border border-white/[0.07] px-2.5 py-1.5 text-[10px] font-medium text-slate-500 hover:border-white/15 hover:text-white">{item}</button>)}</div>
      </div>
    </section>

    {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 rounded-2xl border border-red-400/15 bg-red-400/[0.05] p-4 text-sm text-red-300">{error}</motion.div>}
    {data ? <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6"><div className="mb-4 flex items-end justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-blue-400">Results</p><h2 className="mt-1 text-xl font-semibold text-white">{code} economic history</h2></div><p className="text-xs text-slate-600">Last 20 observations</p></div><div className="grid gap-6 xl:grid-cols-2"><DataChart title="Gross domestic product" eyebrow="GDP · current US$" data={data.gdpData} color="#5b8cff" formatter={formatGDP}/><DataChart title="Population" eyebrow="People · total" data={data.popData} color="#4dd9c0" formatter={formatPopulation}/></div></motion.div> : !loading && !error && <div className="mt-6 rounded-3xl border border-dashed border-white/[0.08] py-20 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.035] text-slate-600"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2"/></svg></div><p className="mt-4 text-sm text-slate-500">Your country analysis will appear here.</p></div>}
  </WorkspaceShell>;
}
