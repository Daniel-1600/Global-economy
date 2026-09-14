"use client";

import WorkspaceShell from "@/components/WorkspaceShell";
import { motion } from "framer-motion";
import { useState } from "react";

const tabs = ["Profile", "Preferences", "Notifications", "Data"];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return <button type="button" onClick={onChange} className={`relative h-6 w-11 rounded-full ${enabled ? "bg-blue-500" : "bg-slate-800"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${enabled ? "left-6" : "left-1"}`} /></button>;
}

export default function Settings() {
  const [active, setActive] = useState("Profile");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [dataAlerts, setDataAlerts] = useState(false);
  const input = "w-full rounded-xl border border-white/[0.08] bg-[#090e18] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10";

  return <WorkspaceShell title="Settings" eyebrow="Workspace">
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-2xl border border-white/[0.07] bg-[#0d1320] p-2">
        {tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm ${active === tab ? "bg-blue-500/10 text-blue-300" : "text-slate-500 hover:bg-white/[0.03] hover:text-white"}`}>{tab}{active === tab && <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />}</button>)}
      </aside>

      <motion.section key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0d1320]">
        <div className="border-b border-white/[0.06] px-6 py-5 sm:px-8"><p className="text-xs uppercase tracking-[.18em] text-slate-600">Account settings</p><h2 className="mt-1 text-xl font-semibold text-white">{active}</h2></div>

        {active === "Profile" && <div className="p-6 sm:p-8"><div className="mb-8 flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-lg font-semibold text-white">EX</div><div><p className="font-medium text-white">Explorer profile</p><button className="mt-1 text-xs text-blue-400 hover:text-cyan-300">Change avatar</button></div></div><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm text-slate-400"><span className="mb-2 block">Full name</span><input className={input} defaultValue="Economy Explorer" /></label><label className="text-sm text-slate-400"><span className="mb-2 block">Email address</span><input className={input} type="email" defaultValue="explorer@example.com" /></label><label className="text-sm text-slate-400 sm:col-span-2"><span className="mb-2 block">Bio</span><textarea className={`${input} min-h-28 resize-none`} placeholder="What are you researching?" /></label></div><div className="mt-7 flex justify-end"><button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-100">Save changes</button></div></div>}

        {active === "Preferences" && <div className="space-y-6 p-6 sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm text-slate-400"><span className="mb-2 block">Currency</span><select className={input} defaultValue="USD"><option>USD</option><option>EUR</option><option>KES</option><option>GBP</option></select></label><label className="text-sm text-slate-400"><span className="mb-2 block">Number format</span><select className={input}><option>1.25 trillion</option><option>1,250,000,000,000</option></select></label><label className="text-sm text-slate-400"><span className="mb-2 block">Default region</span><select className={input}><option>Global</option><option>Africa</option><option>Asia</option><option>Europe</option><option>Americas</option><option>Oceania</option></select></label><label className="text-sm text-slate-400"><span className="mb-2 block">Timezone</span><select className={input} defaultValue="Africa/Nairobi"><option>Africa/Nairobi</option><option>UTC</option><option>Europe/London</option><option>America/New_York</option></select></label></div><div className="flex justify-end"><button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-100">Save preferences</button></div></div>}

        {active === "Notifications" && <div className="divide-y divide-white/[0.06] p-6 sm:p-8">{[
          { title: "Product updates", copy: "News about improvements and new analysis tools.", value: emailUpdates, change: () => setEmailUpdates(!emailUpdates) },
          { title: "Weekly economic digest", copy: "A concise summary of notable changes each week.", value: weeklyDigest, change: () => setWeeklyDigest(!weeklyDigest) },
          { title: "Data refresh alerts", copy: "Get notified when new World Bank observations are stored.", value: dataAlerts, change: () => setDataAlerts(!dataAlerts) },
        ].map((item) => <div key={item.title} className="flex items-center justify-between gap-6 py-5 first:pt-0 last:pb-0"><div><p className="text-sm font-medium text-white">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.copy}</p></div><Toggle enabled={item.value} onChange={item.change}/></div>)}</div>}

        {active === "Data" && <div className="p-6 sm:p-8"><div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.04] p-5"><div className="flex items-center gap-2 text-sm font-medium text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-300"/>PostgreSQL connected</div><p className="mt-2 text-xs leading-5 text-slate-500">Dashboard and country explorer views read stored GDP and population records from your configured database.</p></div><div className="mt-5 rounded-2xl border border-white/[0.07] p-5"><p className="text-sm font-medium text-white">Refresh economic data</p><p className="mt-2 text-xs leading-5 text-slate-500">Use the backend import endpoint when you want to pull a fresh World Bank snapshot into PostgreSQL.</p><code className="mt-4 block overflow-x-auto rounded-xl bg-[#080d17] p-4 text-xs text-cyan-300">POST /api/economy/store</code></div></div>}
      </motion.section>
    </div>
  </WorkspaceShell>;
}
