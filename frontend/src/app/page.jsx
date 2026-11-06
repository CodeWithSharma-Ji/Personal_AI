"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      {/* Apple Monochromatic Light Navigation Bar (Status Completely Removed) */}
      <nav className="sticky top-0 z-50 border-b border-black/[0.08] bg-white/80 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </span>
              <span className="text-xs font-semibold tracking-tight text-[#1d1d1f] uppercase">
                Studio
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-xs text-[#6e6e73]">
              <a href="#overview" className="hover:text-black transition-colors">Overview</a>
              <a href="#workbench" className="hover:text-black transition-colors">Workbench</a>
              <a href="#architecture" className="hover:text-black transition-colors">Architecture</a>
              <a href="#specifications" className="hover:text-black transition-colors">Specifications</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="rounded-full bg-black text-white hover:bg-[#333336] px-4 py-1.5 text-xs font-medium transition-all active:scale-95 shadow-sm"
            >
              Launch Workbench
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="overview" className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-white border-b border-black/[0.08]">
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          {/* Grand Headline */}
          <h1 className="max-w-none text-4xl font-semibold tracking-tight sm:text-6xl md:text-7xl text-gradient-mono">
            Pure Intelligence.
            <br />
            <span className="text-gradient-subtle">Engineered for speed.</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#6e6e73]">
            A refined intelligence platform built with zero-trust server isolation, sub-second inference execution, and modern decoupled architecture.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2c2c2e] active:scale-95 shadow-sm"
            >
              <span>Launch Workbench</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <a
              href="#architecture"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#d2d2d7] bg-white px-6 py-2.5 text-sm font-medium text-[#1d1d1f] transition-all hover:bg-[#f5f5f7]"
            >
              <span>Explore Architecture</span>
              <span className="text-[#8e8e93]">›</span>
            </a>
          </div>

          {/* Monochromatic Stat Strip */}
          <div className="mt-16 grid grid-cols-2 gap-6 border-t border-black/[0.08] pt-10 sm:grid-cols-4">
            <div className="p-2">
              <div className="text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">500+</div>
              <div className="mt-1 text-xs text-[#6e6e73]">tokens / second</div>
            </div>
            <div className="p-2">
              <div className="text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">&lt;120ms</div>
              <div className="mt-1 text-xs text-[#6e6e73]">first token latency</div>
            </div>
            <div className="p-2">
              <div className="text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">100%</div>
              <div className="mt-1 text-xs text-[#6e6e73]">credential isolation</div>
            </div>
            <div className="p-2">
              <div className="text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">131K</div>
              <div className="mt-1 text-xs text-[#6e6e73]">context window</div>
            </div>
          </div>
        </div>
      </section>

      {/* Workbench Showcase Section (Links to dedicated /chat experience) */}
      <section id="workbench" className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest text-[#6e6e73] uppercase">
              Dedicated Environment
            </span>
            <h2 className="mt-2 max-w-none text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">
              The Intelligence Workbench.
            </h2>
            <p className="mt-2 text-sm text-[#6e6e73]">
              A distraction-free, dedicated full-screen environment for deep reasoning and rapid completions.
            </p>
          </div>

          {/* Studio Display Hardware Preview */}
          <div className="relative rounded-3xl border border-black/[0.08] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">
            {/* Title Bar / Window Chrome */}
            <div className="flex h-11 items-center justify-between border-b border-black/[0.08] bg-[#fbfbfd] px-4 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#d1d1d6] inline-block" />
                <span className="h-3 w-3 rounded-full bg-[#aeaeb2] inline-block" />
                <span className="h-3 w-3 rounded-full bg-[#8e8e93] inline-block" />
                <span className="ml-3 text-xs font-medium text-[#6e6e73]">
                  chat.personal.ai · Console
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-black/[0.04] border border-black/[0.06] px-2.5 py-0.5 text-[10px] font-mono text-[#6e6e73]">
                  qwen/qwen3.8-27b
                </span>
              </div>
            </div>

            {/* Workbench Showcase Body */}
            <div className="flex flex-col p-6 sm:p-10 bg-[#fbfbfd]">
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.04] border border-black/[0.06] mb-4">
                  <svg className="h-6 w-6 text-[#1d1d1f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1d1d1f]">
                  Dedicated Chat Interface
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#6e6e73] max-w-md">
                  Experience full-page conversations with live token streaming and AbortSignal resilience.
                </p>

                <div className="mt-6 mb-2">
                  <div className="text-2xl font-semibold text-[#1d1d1f]">
                    Good day.
                  </div>
                  <p className="mt-1 text-sm text-[#6e6e73]">
                    How can I help you today?
                  </p>
                </div>

                <div className="mt-6">
                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-xs sm:text-sm font-medium text-white transition-all hover:bg-[#2c2c2e] active:scale-95 shadow-sm"
                  >
                    <span>Launch Workbench</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monochromatic Bento Grid Section */}
      <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-black/[0.08] bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest text-[#6e6e73] uppercase">
              System Design
            </span>
            <h2 className="mt-2 max-w-none text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">
              Engineered with restraint.
            </h2>
            <p className="mt-3 text-sm text-[#6e6e73] max-w-xl mx-auto">
              Every layer has been tuned for speed, isolation, and architectural resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bento Card 1: Hardware Acceleration (2 Cols) */}
            <div className="md:col-span-2 apple-glass-card rounded-3xl p-8 flex flex-col justify-between group">
              <div>
                <span className="text-xs font-semibold text-[#6e6e73] tracking-wider uppercase">
                  Hardware Acceleration
                </span>
                <h3 className="mt-2 max-w-none text-2xl font-semibold text-[#1d1d1f]">
                  Sub-second response. Instant reasoning.
                </h3>
                <p className="mt-2 text-sm text-[#6e6e73] max-w-md leading-relaxed">
                  Leveraging specialized tensor streaming processors for real-time generation with zero queue delays.
                </p>
              </div>

              {/* Monochromatic Waveform */}
              <div className="mt-8 flex items-end gap-1.5 h-14 pt-4 border-t border-black/[0.06]">
                {[35, 60, 80, 50, 95, 65, 80, 100, 55, 90, 70, 95, 85].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 rounded-full bg-black/80 transition-all duration-300 group-hover:bg-black"
                  />
                ))}
              </div>
            </div>

            {/* Bento Card 2: Security Enclave (1 Col) */}
            <div className="apple-glass-card rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#6e6e73] tracking-wider uppercase">
                  Security Enclave
                </span>
                <h3 className="mt-2 max-w-none text-xl font-semibold text-[#1d1d1f]">
                  Zero credential exposure.
                </h3>
                <p className="mt-2 text-xs text-[#6e6e73] leading-relaxed">
                  Provider API credentials remain safely insulated inside the server runtime, never exposed to client browsers.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#f5f5f7] p-3 border border-black/[0.06] font-mono text-[11px] text-[#1d1d1f]">
                <span className="h-1.5 w-1.5 rounded-full bg-black" />
                <span>AI_API_KEY: Insulated</span>
              </div>
            </div>

            {/* Bento Card 3: Model Interchangeability (1 Col) */}
            <div className="apple-glass-card rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#6e6e73] tracking-wider uppercase">
                  Universal Standard
                </span>
                <h3 className="mt-2 max-w-none text-xl font-semibold text-[#1d1d1f]">
                  Interchangeable backends.
                </h3>
                <p className="mt-2 text-xs text-[#6e6e73] leading-relaxed">
                  Swap providers with a single environment variable change. Compatible with cloud APIs and local instances.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#f5f5f7] border border-black/[0.08] px-2.5 py-1 text-[10px] font-medium text-[#1d1d1f]">Cloud</span>
                <span className="rounded-full bg-[#f5f5f7] border border-black/[0.08] px-2.5 py-1 text-[10px] font-medium text-[#1d1d1f]">OpenAI API</span>
                <span className="rounded-full bg-[#f5f5f7] border border-black/[0.08] px-2.5 py-1 text-[10px] font-medium text-[#1d1d1f]">Local Ollama</span>
              </div>
            </div>

            {/* Bento Card 4: Turbopack Core (2 Cols) */}
            <div className="md:col-span-2 apple-glass-card rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#6e6e73] tracking-wider uppercase">
                  Runtime Core
                </span>
                <h3 className="mt-2 max-w-none text-2xl font-semibold text-[#1d1d1f]">
                  Server Engine with AbortSignal Guard.
                </h3>
                <p className="mt-2 text-sm text-[#6e6e73] max-w-lg leading-relaxed">
                  Engineered with strict JSON payload validation, defensive 60-second timeouts, and decoupled client-server routing.
                </p>
              </div>

              <div className="mt-6 rounded-2xl bg-[#f5f5f7] p-4 border border-black/[0.06] font-mono text-xs text-[#1d1d1f] overflow-x-auto">
                <div className="text-[#8e8e93]">// Resilient proxy dispatch with timeout guard</div>
                <div className="mt-1">
                  <span className="font-semibold text-black">const</span> response = <span className="font-semibold text-black">await</span> fetch(AI_API_URL, &#123;
                </div>
                <div className="pl-4 text-[#48484a]">signal: AbortSignal.timeout(60000)</div>
                <div>&#125;);</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications Table (Monochromatic) */}
      <section id="specifications" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-black/[0.08] bg-[#f5f5f7]">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest text-[#6e6e73] uppercase">
              Technical Specifications
            </span>
            <h2 className="mt-2 max-w-none text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              System architecture at a glance.
            </h2>
          </div>

          <div className="rounded-2xl border border-black/[0.08] bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-black/[0.08] bg-[#fbfbfd] text-[#6e6e73]">
                <tr>
                  <th className="py-3 px-4 sm:px-6 font-medium">Component</th>
                  <th className="py-3 px-4 sm:px-6 font-medium">Specification</th>
                  <th className="py-3 px-4 sm:px-6 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05] text-[#1d1d1f]">
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-medium">Inference Layer</td>
                  <td className="py-3.5 px-4 sm:px-6 text-[#6e6e73]">Hardware Accelerated Tensor Processing</td>
                  <td className="py-3.5 px-4 sm:px-6 text-right font-mono text-xs text-black">Active</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-medium">Configured Model</td>
                  <td className="py-3.5 px-4 sm:px-6 text-[#6e6e73] font-mono text-xs">qwen/qwen3.8-27b</td>
                  <td className="py-3.5 px-4 sm:px-6 text-right font-mono text-xs text-[#6e6e73]">131K Context</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-medium">Proxy Layer</td>
                  <td className="py-3.5 px-4 sm:px-6 text-[#6e6e73]">Server Route Handler (/api/chat)</td>
                  <td className="py-3.5 px-4 sm:px-6 text-right font-mono text-xs text-black">Port 3001</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-medium">Client Interface</td>
                  <td className="py-3.5 px-4 sm:px-6 text-[#6e6e73]">React 19 Client Hub</td>
                  <td className="py-3.5 px-4 sm:px-6 text-right font-mono text-xs text-black">Port 3000</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-medium">Timeout Protection</td>
                  <td className="py-3.5 px-4 sm:px-6 text-[#6e6e73]">60,000 milliseconds guard</td>
                  <td className="py-3.5 px-4 sm:px-6 text-right font-mono text-xs text-black">Enforced</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-medium">Payload Limit</td>
                  <td className="py-3.5 px-4 sm:px-6 text-[#6e6e73]">12,000 characters per message</td>
                  <td className="py-3.5 px-4 sm:px-6 text-right font-mono text-xs text-black">Enforced</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Monochromatic Light Footer */}
      <footer className="border-t border-black/[0.08] bg-white py-12 px-4 sm:px-6 lg:px-8 text-xs text-[#6e6e73]">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="space-y-1 text-[11px] leading-relaxed">
            <p>1. Token generation rates depend on upstream provider load and model concurrency.</p>
            <p>2. The application does not store, log, or persist user prompts across sessions by design.</p>
            <p>3. Compatible with all OpenAI Chat Completions v1 specifications, including self-hosted LLM endpoints.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/[0.08] pt-6">
            <div>
              Copyright © 2026. Built with precision.
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-black transition-colors">
                Back to top ↑
              </button>
              <Link href="/chat" className="hover:text-black transition-colors">
                Workbench
              </Link>
              <a href="#specifications" className="hover:text-black transition-colors">
                Specifications
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
