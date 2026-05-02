"use client";

import { useState } from "react";

const PILLARS = [
  { value: "inflammatory_foods", label: "Food as inflammatory trigger" },
  { value: "gut_immune", label: "Gut–immune connection" },
  { value: "hidden_culprits", label: "Hidden dietary culprits" },
  { value: "ancient_foods", label: "Ancient foods, modern science" },
  { value: "autoimmune", label: "Autoimmune reversal" },
];

const FORMATS = [
  { value: "educational", label: "Educational" },
  { value: "myth-bust", label: "Myth-bust" },
  { value: "story", label: "Story / case" },
  { value: "question", label: "Question post" },
  { value: "list", label: "List (3–5 points)" },
];

const TOPIC_IDEAS = [
  "Why whole wheat bread spikes inflammation worse than white bread",
  "The connection between gluten and joint pain has nothing to do with digestion",
  "Lectins in beans — what fermentation actually does to them",
  "Why your 'healthy' green smoothie may be feeding autoimmunity",
  "Seed oils and the linoleic acid problem your cardiologist doesn't track",
  "Bone broth and intestinal permeability — the zonulin mechanism",
  "What your 3pm crash is actually telling you about your gut",
  "Oxalates in spinach: the hidden cost of the superfood",
  "Why fermented foods work better than probiotics in most cases",
  "The difference between food sensitivity and food allergy — and why it matters",
];

interface GeneratedPost {
  caption: string;
  hook: string;
  hashtags: string[];
  content_pillar: string;
}

export default function StudioPage() {
  const [topic, setTopic] = useState("");
  const [pillar, setPillar] = useState("");
  const [format, setFormat] = useState("educational");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedPost | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);

    try {
      const res = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, pillar, format }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    if (!result) return;
    const text = `${result.caption}\n\n${result.hashtags.join(" ")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="border-b border-stone-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="font-serif text-lg text-stone-800">The Gut Alchemist</span>
            <span className="ml-3 text-stone-400 text-sm">Content Studio</span>
          </div>
          <a href="/" className="text-xs text-stone-400 hover:text-stone-600">← Landing page</a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="section-label mb-2">Instagram Content Studio</p>
          <h1 className="font-serif text-4xl text-stone-900">Generate in Elias&apos;s voice.</h1>
          <p className="text-stone-500 mt-3">Every post is locked to the persona — no exclamation points, no hype, no generic health content.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input panel */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Topic or idea
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                placeholder="e.g. Why seed oils are worse than saturated fat for gut permeability"
                className="w-full border border-stone-300 rounded-sm px-4 py-3 text-stone-900 bg-white focus:outline-none focus:border-amber-500 text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Content pillar
                </label>
                <select
                  value={pillar}
                  onChange={(e) => setPillar(e.target.value)}
                  className="w-full border border-stone-300 rounded-sm px-3 py-2 text-stone-900 bg-white focus:outline-none focus:border-amber-500 text-sm"
                >
                  <option value="">Auto-select</option>
                  {PILLARS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full border border-stone-300 rounded-sm px-3 py-2 text-stone-900 bg-white focus:outline-none focus:border-amber-500 text-sm"
                >
                  {FORMATS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading || !topic.trim()}
              className="btn-primary w-full py-4 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Writing..." : "Generate Post"}
            </button>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            {/* Topic ideas */}
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mb-3">Topic ideas</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {TOPIC_IDEAS.map((idea) => (
                  <button
                    key={idea}
                    onClick={() => setTopic(idea)}
                    className="w-full text-left text-xs text-stone-500 hover:text-stone-800 hover:bg-stone-100 px-3 py-2 rounded-sm transition-colors"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output panel */}
          <div>
            {result ? (
              <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
                {/* Post preview header */}
                <div className="border-b border-stone-100 px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm">🌿</div>
                    <div>
                      <div className="text-xs font-semibold text-stone-800">gut_alchemist</div>
                      <div className="text-xs text-stone-400">The Gut Alchemist</div>
                    </div>
                  </div>
                  <div className="w-6 h-6 flex flex-col gap-1 justify-center items-end">
                    <div className="w-4 h-0.5 bg-stone-400 rounded"></div>
                    <div className="w-3 h-0.5 bg-stone-400 rounded"></div>
                    <div className="w-4 h-0.5 bg-stone-400 rounded"></div>
                  </div>
                </div>

                {/* Post image placeholder */}
                <div className="bg-amber-950 aspect-square flex items-center justify-center">
                  <div className="text-center px-8">
                    <div className="text-amber-300 font-serif text-xl leading-snug italic">
                      &ldquo;{result.hook}&rdquo;
                    </div>
                    <div className="text-amber-600 text-xs mt-4 uppercase tracking-widest">gut_alchemist</div>
                  </div>
                </div>

                {/* Caption */}
                <div className="px-5 py-4">
                  <p className="text-xs text-stone-900 leading-relaxed whitespace-pre-line">
                    {result.caption}
                  </p>
                  <p className="text-xs text-blue-500 mt-3 leading-relaxed">
                    {result.hashtags.join(" ")}
                  </p>
                </div>

                {/* Meta */}
                <div className="border-t border-stone-100 px-5 py-3 flex items-center justify-between">
                  <span className="text-xs text-stone-400">{result.content_pillar}</span>
                  <button
                    onClick={copyToClipboard}
                    className="text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
                  >
                    {copied ? "Copied." : "Copy caption + tags"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-stone-200 rounded-sm h-full min-h-96 flex items-center justify-center">
                <div className="text-center text-stone-300">
                  <div className="text-5xl mb-4">🌿</div>
                  <p className="text-sm">Your generated post will appear here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
