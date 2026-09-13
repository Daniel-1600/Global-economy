import Footer from "@/components/footer";
import Hero from "@/components/Hero";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="bg-[#070b14] px-5 pb-24 sm:px-8 sm:pb-32">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-blue-400/15 bg-gradient-to-br from-blue-500/15 via-[#10182a] to-cyan-300/[0.06] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-blue-400/15 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan-300">Start exploring</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">A clearer view of the global economy is one click away.</h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">Open the dashboard for the big picture, or go straight to country-level data.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/dashboard" className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-cyan-100">Open dashboard</Link>
              <Link href="/countries" className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white hover:bg-white/[0.08]">Explore countries</Link>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
