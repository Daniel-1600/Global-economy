"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(form.password !== form.confirmPassword ? "Passwords do not match." : "Registration needs to be connected to an authentication provider.");
  };

  const field = (key: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <label className="block text-sm text-slate-300">
      <span className="mb-2 block">{label}</span>
      <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} required className="w-full rounded-xl border border-white/[0.08] bg-[#090e18] px-4 py-3.5 text-white outline-none placeholder:text-slate-700 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10" />
    </label>
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b14] px-5 py-10 sm:px-8">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-14 lg:grid-cols-2">
        <section className="hidden lg:block">
          <Link href="/" className="inline-flex items-center gap-3 text-sm font-semibold text-white"><span className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-300/20 bg-blue-500/10 text-xs text-cyan-200">GE</span>Global Economy</Link>
          <p className="mt-20 text-xs font-semibold uppercase tracking-[.22em] text-cyan-300">Create your workspace</p>
          <h1 className="mt-5 max-w-lg text-5xl font-semibold leading-[1.05] tracking-tight text-white">Keep your economic research in one clear place.</h1>
          <p className="mt-6 max-w-md leading-7 text-slate-500">Build watchlists, return to country histories, and keep your view of the global economy organized.</p>
        </section>

        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md rounded-[2rem] border border-white/[0.08] bg-[#0d1320]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
          <Link href="/" className="mb-8 flex items-center gap-3 text-sm font-semibold text-white lg:hidden"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/15 text-xs text-cyan-200">GE</span>Global Economy</Link>
          <h2 className="text-2xl font-semibold text-white">Create an account</h2>
          <p className="mt-2 text-sm text-slate-500">Start exploring global economic data.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {field("name", "Full name", "text", "Your name")}
            {field("email", "Email address", "email", "you@example.com")}
            <div className="grid gap-5 sm:grid-cols-2">{field("password", "Password", "password", "At least 6 characters")}{field("confirmPassword", "Confirm", "password", "Repeat password")}</div>
            {message && <p className="rounded-xl border border-amber-300/15 bg-amber-300/[0.06] p-3 text-xs leading-5 text-amber-200">{message}</p>}
            <button type="submit" className="w-full rounded-xl bg-white py-3.5 text-sm font-semibold text-slate-950 hover:bg-cyan-100">Create account</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link href="/login" className="font-medium text-cyan-300 hover:text-cyan-200">Sign in</Link></p>
        </motion.section>
      </div>
    </main>
  );
}
