"use client";

import { useState, FormEvent } from "react";

const PILLARS = [
  {
    icon: "🔥",
    title: "Food as inflammatory trigger",
    body: "The foods marketed as healthy are often the ones most quietly destroying your gut lining. We name them.",
  },
  {
    icon: "🧫",
    title: "Gut–immune system connection",
    body: "70% of your immune system lives in your gut wall. When that wall leaks, your immune system stops defending — and starts attacking.",
  },
  {
    icon: "🕵️",
    title: "Hidden dietary culprits",
    body: "Oxalates. Lectins. Seed oils disguised as 'heart-healthy.' Most elimination protocols miss half the list.",
  },
  {
    icon: "🌿",
    title: "Ancient foods modern science confirms",
    body: "Bone broth. Fermented vegetables. Bitter herbs. Not trends — tools that have been working for 10,000 years, now with the mechanistic studies to explain why.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I spent three years going to rheumatologists. Six weeks into Elias's protocol my inflammation markers dropped in half. My doctor asked what I changed.",
    name: "M.K.",
    detail: "Hashimoto's, 34",
  },
  {
    quote:
      "I thought I was just 'sensitive.' Turns out I was eating the same four inflammatory triggers every single day. Once I saw the list I couldn't unsee it.",
    name: "R.P.",
    detail: "IBS-C, 41",
  },
  {
    quote:
      "No urgency. No hype. Just the information laid out plainly with the science behind it. I've read dozens of gut health books. This is the one I reread.",
    name: "T.A.",
    detail: "Autoimmune, 29",
  },
];

const WHAT_YOU_GET = [
  "The complete 21-day inflammatory trigger identification protocol",
  "The 47-food elimination matrix — ranked by inflammatory load",
  "Gut-lining repair phase: what to eat, when, and why",
  "The reintroduction method that actually tells you what's wrong",
  "Ancient food preparation techniques that change the chemistry of what you eat",
  "The supplement stack Elias uses — with mechanisms and dosing, not guesswork",
  "The 12 lab markers that tell the real story (and how to read them yourself)",
];

const FAQ = [
  {
    q: "Is this a diet?",
    a: "No. It's an identification protocol. You're not giving up food forever. You're temporarily removing variables so your body can finally show you what it's been reacting to.",
  },
  {
    q: "I've done elimination diets before. How is this different?",
    a: "Most elimination protocols remove 4–6 foods. This one removes 47 — ranked by the evidence on gut permeability, immune activation, and inflammatory load. The order matters. So does the reintroduction timing.",
  },
  {
    q: "Do I need to see a doctor first?",
    a: "If you have an active autoimmune diagnosis or are on immunosuppressants, yes — work with your provider. This protocol is educational, not medical advice. But it's built on the same logic functional medicine clinicians use every day.",
  },
  {
    q: "How long does it take?",
    a: "The elimination phase is 21 days. Most people notice signal within the first week. The full picture — including reintroduction — takes 6–8 weeks.",
  },
  {
    q: "Is there a refund policy?",
    a: "30 days, no questions. If you do the protocol and feel no different, ask for your money back. Simple.",
  },
];

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-stone-50 font-sans">
      {/* ── NAV ── */}
      <nav className="border-b border-stone-200 bg-stone-50/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-serif text-lg text-stone-800 tracking-tight">
            The Gut Alchemist
          </span>
          <div className="flex items-center gap-3">
            <a href="/studio" className="text-xs text-stone-500 hover:text-stone-800 transition-colors">
              Content Studio
            </a>
            <a href="#get-it" className="btn-primary text-xs py-2 px-5">
              Get the Protocol
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <p className="section-label mb-6">Elias Root — The Gut Alchemist Protocol</p>
        <h1 className="font-serif text-5xl md:text-6xl leading-tight text-stone-900 mb-8">
          Your body isn't broken.
          <br />
          <span className="text-amber-700">It's responding.</span>
          <br />
          Here's what it's responding to.
        </h1>
        <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed mb-12">
          A 21-day protocol to identify every hidden inflammatory trigger in your
          diet — built on 10,000 years of herbal medicine and the mechanistic
          science that finally explains why it works.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#get-it" className="btn-primary">
            Get the Protocol — $37
          </a>
          <a href="#how-it-works" className="btn-secondary">
            How it works
          </a>
        </div>
        <p className="text-stone-400 text-xs mt-6">
          30-day money-back guarantee · Instant download
        </p>
      </section>

      {/* ── CREDIBILITY BAR ── */}
      <section className="bg-amber-950 text-amber-100 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              ["47", "Foods in the elimination matrix"],
              ["21", "Day identification protocol"],
              ["12", "Lab markers explained"],
              ["30", "Day refund guarantee"],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="font-serif text-4xl text-amber-300 mb-1">{num}</div>
                <div className="text-xs text-amber-400 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <p className="section-label mb-4">The problem</p>
        <h2 className="font-serif text-4xl text-stone-900 mb-8 leading-snug">
          You've been treating symptoms.<br />
          You haven't found the source.
        </h2>
        <div className="space-y-5 text-lg text-stone-600 leading-relaxed">
          <p>
            The bloating. The fatigue that doesn't lift no matter how much you sleep.
            The skin flares. The brain fog that descends by 2pm. You've been told
            these are separate problems.
          </p>
          <p>
            They're not. They're one signal, coming from one place. And that place —
            in the overwhelming majority of cases — is the gut.
          </p>
          <p>
            Specifically: a gut wall that has been silently degraded by foods your
            doctor never thought to ask you about. Foods that aren't on any standard
            elimination protocol. Foods that are, in many cases, the ones you've been
            told to eat more of.
          </p>
          <p className="font-semibold text-stone-800 border-l-2 border-amber-600 pl-4">
            The gut alchemist's job is not to give you another supplement to mask the
            signal. It's to help you read the signal correctly — and remove whatever
            is causing it.
          </p>
        </div>
      </section>

      {/* ── CONTENT PILLARS ── */}
      <section
        id="how-it-works"
        className="bg-white border-y border-stone-200 py-24"
      >
        <div className="max-w-4xl mx-auto px-6">
          <p className="section-label mb-4 text-center">What the protocol addresses</p>
          <h2 className="font-serif text-4xl text-stone-900 mb-16 text-center leading-snug">
            Four pillars. One framework.
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="border border-stone-200 rounded-sm p-8 hover:border-amber-300 transition-colors"
              >
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="font-serif text-xl text-stone-900 mb-3">{p.title}</h3>
                <p className="text-stone-500 leading-relaxed text-sm">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ELIAS ── */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-shrink-0">
            <div className="w-48 h-48 rounded-sm bg-amber-100 border border-amber-200 flex items-center justify-center overflow-hidden">
              <span className="text-6xl">🌿</span>
            </div>
          </div>
          <div>
            <p className="section-label mb-4">About</p>
            <h2 className="font-serif text-3xl text-stone-900 mb-6">Elias Root</h2>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                Trained in both traditional herbalism and functional biochemistry,
                Elias has spent two decades inside the intersection where ancient plant
                medicine meets peer-reviewed mechanistic science.
              </p>
              <p>
                He doesn't treat diagnoses. He identifies the upstream conditions that
                produce them — starting, almost always, with what someone is eating
                and how their gut has been damaged by it.
              </p>
              <p className="text-stone-800 font-medium">
                "I've never met a chronic inflammatory condition that wasn't, at its
                root, a gut problem. And I've never met a gut problem that couldn't be
                addressed by removing the right variables and rebuilding from there."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-amber-950 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <p className="section-label mb-4 text-center text-amber-400">
            What people say
          </p>
          <h2 className="font-serif text-4xl text-amber-50 mb-16 text-center">
            The protocol works.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="border border-amber-800 rounded-sm p-8">
                <p className="text-amber-100 leading-relaxed text-sm mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div className="text-amber-300 font-semibold text-sm">{t.name}</div>
                  <div className="text-amber-600 text-xs">{t.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <p className="section-label mb-4">Inside the protocol</p>
        <h2 className="font-serif text-4xl text-stone-900 mb-12 leading-snug">
          Everything in one place.<br />Nothing you don't need.
        </h2>
        <ul className="space-y-4">
          {WHAT_YOU_GET.map((item) => (
            <li key={item} className="flex items-start gap-4 text-stone-700">
              <span className="text-amber-600 mt-0.5 flex-shrink-0 font-bold">→</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── BUY CTA ── */}
      <section
        id="get-it"
        className="bg-stone-900 text-stone-50 py-24"
      >
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="section-label mb-4 text-amber-400">The offer</p>
          <h2 className="font-serif text-5xl mb-6 leading-tight">
            The Gut Alchemist Protocol
          </h2>
          <p className="text-stone-400 mb-10 leading-relaxed text-lg">
            A complete 21-day identification and repair framework. Instant PDF
            download. One-time purchase. Yours permanently.
          </p>
          <div className="bg-stone-800 border border-stone-700 rounded-sm p-10 mb-8">
            <div className="text-stone-400 text-sm line-through mb-1">$67</div>
            <div className="font-serif text-6xl text-amber-300 mb-2">$37</div>
            <div className="text-stone-400 text-sm mb-8">One-time · Instant download · 30-day guarantee</div>
            <button className="btn-primary w-full text-base py-5 mb-4">
              Get the Protocol Now — $37
            </button>
            <p className="text-stone-500 text-xs">
              Secure checkout · PDF delivered instantly · 30-day money-back, no questions
            </p>
          </div>
          <p className="text-stone-500 text-sm italic">
            "If you do the protocol and feel no different in 30 days, I'll refund
            every dollar. I have no interest in keeping money for something that
            didn't help you."
          </p>
          <p className="text-amber-400 font-semibold mt-2 text-sm">— Elias Root</p>
        </div>
      </section>

      {/* ── EMAIL CAPTURE (free chapter) ── */}
      <section className="bg-amber-50 border-y border-amber-200 py-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="section-label mb-4">Not ready to buy?</p>
          <h2 className="font-serif text-3xl text-stone-900 mb-4">
            Get Chapter 1 free.
          </h2>
          <p className="text-stone-500 mb-8 leading-relaxed">
            The 12 hidden inflammatory foods most gut protocols never mention. Enter
            your email and I&apos;ll send it now.
          </p>
          {submitted ? (
            <div className="bg-amber-100 border border-amber-300 rounded-sm p-6 text-amber-900">
              <p className="font-semibold mb-1">It&apos;s on its way.</p>
              <p className="text-sm text-amber-700">
                Check your inbox. Chapter 1 should arrive in the next few minutes.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 border border-stone-300 rounded-sm px-4 py-3 text-stone-900 bg-white focus:outline-none focus:border-amber-500 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary whitespace-nowrap py-3"
              >
                {loading ? "Sending..." : "Send Chapter 1"}
              </button>
            </form>
          )}
          <p className="text-stone-400 text-xs mt-4">
            No spam. Unsubscribe any time. Your email is never shared.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-2xl mx-auto px-6 py-24">
        <p className="section-label mb-4">Common questions</p>
        <h2 className="font-serif text-3xl text-stone-900 mb-12">FAQ</h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div
              key={item.q}
              className="border border-stone-200 rounded-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between text-stone-800 font-medium hover:bg-stone-50 transition-colors"
              >
                <span>{item.q}</span>
                <span className="text-amber-600 text-lg ml-4 flex-shrink-0">
                  {openFaq === i ? "−" : "+"}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-stone-500 leading-relaxed text-sm border-t border-stone-100">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-amber-700 text-white py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl mb-6 leading-tight">
            The information exists.<br />
            Most people just haven't seen it.
          </h2>
          <p className="text-amber-100 mb-10 leading-relaxed text-lg">
            21 days. One protocol. Everything you need to finally understand what
            your body has been trying to tell you.
          </p>
          <a href="#get-it" className="bg-white text-amber-800 font-semibold px-10 py-5 rounded-sm inline-block hover:bg-amber-50 transition-colors uppercase tracking-wider text-sm">
            Get the Protocol — $37
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-stone-200 py-10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-serif text-stone-600">The Gut Alchemist</span>
          <p className="text-stone-400 text-xs text-center max-w-lg">
            This protocol is educational and informational. It is not medical advice
            and does not constitute a physician–patient relationship. Consult your
            healthcare provider before beginning any elimination protocol.
          </p>
          <div className="flex gap-4 text-xs text-stone-400">
            <a href="#" className="hover:text-stone-600">Privacy</a>
            <a href="#" className="hover:text-stone-600">Terms</a>
            <a href="#" className="hover:text-stone-600">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
