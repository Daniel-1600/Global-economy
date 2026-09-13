import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#070b14]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="flex items-center gap-3 text-sm font-semibold text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-300/20 bg-blue-500/10 text-xs text-cyan-200">GE</span>
            Global Economy
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">Clear economic context, built from trusted global data.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <Link href="/countries" className="hover:text-white">Countries</Link>
          <Link href="/countryData" className="hover:text-white">Data lab</Link>
          <a href="https://github.com/Daniel-1600/Global-economy" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
        </div>
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} Global Economy</p>
      </div>
    </footer>
  );
}
