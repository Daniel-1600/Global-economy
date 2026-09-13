"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) setError("The email or password is incorrect.");
      else router.push("/dashboard");
    } catch {
      setError("We could not sign you in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b14] px-5 py-10 sm:px-8">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-14 lg:grid-cols-2">
        <section className="hidden lg:block">
          <Link href="/" className="inline-flex items-center gap-3 text-sm font-semibold text-white"><span className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-300/20 bg-blue-500/10 text-xs text-cyan-200">GE</span>Global Economy</Link>
          <p className="mt-20 text-xs font-semibold uppercase tracking-[.22em] text-blue-400">Welcome back</p>
          <h1 className="mt-5 max-w-lg text-5xl font-semibold leading-[1.05] tracking-tight text-white">Your view of the world economy, ready when you are.</h1>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {["Country rankings", "Historical trends", "Regional context"].map((item, index) => <div key={item} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"><span className="text-xs text-cyan-300">0{index + 1}</span><p className="mt-8 text-sm leading-5 text-slate-400">{item}</p></div>)}
          </div>
        </section>

        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md rounded-[2rem] border border-white/[0.08] bg-[#0d1320]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
          <Link href="/" className="mb-8 flex items-center gap-3 text-sm font-semibold text-white lg:hidden"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/15 text-xs text-cyan-200">GE</span>Global Economy</Link>
          <h2 className="text-2xl font-semibold text-white">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">Continue to your economic intelligence workspace.</p>

          <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.09] bg-white py-3.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">
            <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.7 4.7 0 01-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.6c-.9.6-2.1 1-3.4 1a5.9 5.9 0 01-5.5-4.1H3.1v2.7A10 10 0 0012 22Z"/><path fill="#FBBC05" d="M6.5 13.9A6 6 0 016.2 12c0-.7.1-1.3.3-1.9V7.4H3.1A10 10 0 002 12c0 1.7.4 3.2 1.1 4.6l3.4-2.7Z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.7 9.7 0 0012 2a10 10 0 00-8.9 5.4l3.4 2.7A5.9 5.9 0 0112 6Z"/></svg>
            Continue with Google
          </button>
          <div className="my-6 flex items-center gap-4"><span className="h-px flex-1 bg-white/[0.07]"/><span className="text-[11px] uppercase tracking-wider text-slate-600">or email</span><span className="h-px flex-1 bg-white/[0.07]"/></div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <p className="rounded-xl border border-red-400/15 bg-red-400/[0.06] p-3 text-sm text-red-300">{error}</p>}
            <label className="block text-sm text-slate-300"><span className="mb-2 block">Email address</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full rounded-xl border border-white/[0.08] bg-[#090e18] px-4 py-3.5 text-white outline-none placeholder:text-slate-700 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10" /></label>
            <label className="block text-sm text-slate-300"><span className="mb-2 flex justify-between">Password <button type="button" className="text-xs text-slate-500 hover:text-cyan-300">Forgot password?</button></span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required minLength={6} className="w-full rounded-xl border border-white/[0.08] bg-[#090e18] px-4 py-3.5 text-white outline-none placeholder:text-slate-700 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10" /></label>
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-500 py-3.5 text-sm font-semibold text-white hover:bg-blue-400 disabled:cursor-wait disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">New to Global Economy? <Link href="/register" className="font-medium text-cyan-300 hover:text-cyan-200">Create an account</Link></p>
        </motion.section>
      </div>
    </main>
  );
}
