"use client";

import { useState, useRef, useEffect } from "react";

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
  "Why stress destroys your gut lining faster than any food",
  "The LPS endotoxin problem nobody talks about",
  "What happens to your gut bacteria when you eat emulsifiers",
  "The histamine intolerance–gut permeability connection",
  "Why nightshades worsen autoimmunity in susceptible people",
];

interface GeneratedPost {
  caption: string;
  hook: string;
  hashtags: string[];
  content_pillar: string;
}

interface GeneratedScript {
  hook: string;
  body: string;
  close: string;
  full_script: string;
  on_screen_text: string[];
  broll_directions: string[];
  word_count: number;
  estimated_seconds: number;
}

type VideoStatus = "idle" | "submitting" | "pending" | "processing" | "completed" | "failed";
type Tab = "script" | "caption";

export default function StudioPage() {
  const [tab, setTab] = useState<Tab>("script");
  const [topic, setTopic] = useState("");
  const [pillar, setPillar] = useState("");

  // Script state
  const [duration, setDuration] = useState(60);
  const [scriptResult, setScriptResult] = useState<GeneratedScript | null>(null);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [scriptError, setScriptError] = useState("");
  const [copiedScript, setCopiedScript] = useState(false);

  // Caption state
  const [format, setFormat] = useState("educational");
  const [captionResult, setCaptionResult] = useState<GeneratedPost | null>(null);
  const [captionLoading, setCaptionLoading] = useState(false);
  const [captionError, setCaptionError] = useState("");
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Video generation state
  const [videoStatus, setVideoStatus] = useState<VideoStatus>("idle");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoError, setVideoError] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  async function generateScript() {
    if (!topic.trim()) return;
    setScriptLoading(true);
    setScriptError("");
    setScriptResult(null);
    setCopiedScript(false);
    resetVideo();
    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, pillar, duration }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setScriptResult(data);
    } catch (e) {
      setScriptError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setScriptLoading(false);
    }
  }

  async function generateCaption() {
    if (!topic.trim()) return;
    setCaptionLoading(true);
    setCaptionError("");
    setCaptionResult(null);
    setCopiedCaption(false);
    try {
      const res = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, pillar, format }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCaptionResult(data);
    } catch (e) {
      setCaptionError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setCaptionLoading(false);
    }
  }

  function resetVideo() {
    if (pollRef.current) clearInterval(pollRef.current);
    setVideoStatus("idle");
    setVideoId(null);
    setVideoUrl(null);
    setThumbnailUrl(null);
    setVideoDuration(null);
    setVideoError("");
  }

  async function generateVideo() {
    if (!scriptResult) return;
    resetVideo();
    setVideoStatus("submitting");
    setVideoError("");

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: scriptResult.full_script,
          title: `Gut Alchemist — ${topic.slice(0, 50)}`,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const id = data.video_id;
      setVideoId(id);
      setVideoStatus("pending");
      startPolling(id);
    } catch (e) {
      setVideoStatus("failed");
      setVideoError(e instanceof Error ? e.message : "Video generation failed");
    }
  }

  function startPolling(id: string) {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/video-status?video_id=${id}`);
        const data = await res.json();
        if (data.error) {
          clearInterval(pollRef.current!);
          setVideoStatus("failed");
          setVideoError(data.error);
          return;
        }

        setVideoStatus(data.status);

        if (data.status === "completed") {
          clearInterval(pollRef.current!);
          setVideoUrl(data.video_url);
          setThumbnailUrl(data.thumbnail_url);
          setVideoDuration(data.duration);
        } else if (data.status === "failed") {
          clearInterval(pollRef.current!);
          setVideoError("HeyGen reported a failure. Try regenerating.");
        }
      } catch {
        // keep polling on transient network errors
      }
    }, 5000);
  }

  function copyScript() {
    if (!scriptResult) return;
    navigator.clipboard.writeText(scriptResult.full_script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  }

  function copyCaption() {
    if (!captionResult) return;
    const text = `${captionResult.caption}\n\n${captionResult.hashtags.join(" ")}`;
    navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  }

  const scriptGenerating = scriptLoading;
  const captionGenerating = captionLoading;
  const videoInProgress = ["submitting", "pending", "processing"].includes(videoStatus);

  const videoStatusLabel: Record<VideoStatus, string> = {
    idle: "",
    submitting: "Sending to HeyGen...",
    pending: "Queued — generating soon...",
    processing: "Rendering video...",
    completed: "Done.",
    failed: "Failed.",
  };

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="border-b border-stone-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="font-serif text-lg text-stone-800">The Gut Alchemist</span>
            <span className="ml-3 text-stone-400 text-sm">Content Studio</span>
          </div>
          <a href="/" className="text-xs text-stone-400 hover:text-stone-600">← Landing page</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Tabs */}
        <div className="flex gap-1 mb-10 border-b border-stone-200">
          <button
            onClick={() => setTab("script")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === "script"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            Reels Script + Video
          </button>
          <button
            onClick={() => setTab("caption")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === "caption"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            Caption Post
          </button>
        </div>

        <div className="grid md:grid-cols-5 gap-8">

          {/* ── LEFT PANEL ── */}
          <div className="md:col-span-2 space-y-5">

            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">Topic</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                placeholder="e.g. Why seed oils raise LPS endotoxin levels in the gut"
                className="w-full border border-stone-300 rounded-sm px-4 py-3 text-stone-900 bg-white focus:outline-none focus:border-amber-500 text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">Content pillar</label>
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

            {tab === "script" ? (
              <div>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">Duration</label>
                <div className="flex gap-2">
                  {[30, 60, 90].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-2 text-sm rounded-sm border transition-colors ${
                        duration === d
                          ? "bg-amber-600 border-amber-600 text-white"
                          : "border-stone-300 text-stone-600 hover:border-amber-400"
                      }`}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">Format</label>
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
            )}

            <button
              onClick={tab === "script" ? generateScript : generateCaption}
              disabled={(tab === "script" ? scriptGenerating : captionGenerating) || !topic.trim()}
              className="btn-primary w-full py-4 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {tab === "script"
                ? scriptGenerating ? "Writing script..." : `Generate ${duration}s Script`
                : captionGenerating ? "Writing caption..." : "Generate Caption"}
            </button>

            {(scriptError || captionError) && (
              <p className="text-red-600 text-sm">{scriptError || captionError}</p>
            )}

            {/* Topic ideas */}
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mb-2">Ideas</p>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {TOPIC_IDEAS.map((idea) => (
                  <button
                    key={idea}
                    onClick={() => setTopic(idea)}
                    className="w-full text-left text-xs text-stone-500 hover:text-stone-800 hover:bg-stone-100 px-3 py-2 rounded-sm transition-colors leading-snug"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="md:col-span-3 space-y-4">

            {/* SCRIPT OUTPUT */}
            {tab === "script" && (
              <>
                {scriptResult ? (
                  <>
                    {/* Meta bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-xs text-stone-400">
                        <span>{scriptResult.word_count} words</span>
                        <span>~{scriptResult.estimated_seconds}s spoken</span>
                      </div>
                      <button
                        onClick={copyScript}
                        className="text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
                      >
                        {copiedScript ? "Copied." : "Copy full script"}
                      </button>
                    </div>

                    {/* Script sections */}
                    <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
                      <div className="border-b border-stone-100 px-6 py-5">
                        <p className="text-xs text-amber-700 uppercase tracking-wider font-semibold mb-3">Hook — 0:00–0:03</p>
                        <p className="text-stone-900 font-serif text-xl leading-snug">{scriptResult.hook}</p>
                      </div>
                      <div className="border-b border-stone-100 px-6 py-5">
                        <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-3">Body</p>
                        <p className="text-stone-700 leading-relaxed text-sm whitespace-pre-line">{scriptResult.body}</p>
                      </div>
                      <div className="px-6 py-5">
                        <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-3">Close</p>
                        <p className="text-stone-700 leading-relaxed text-sm whitespace-pre-line">{scriptResult.close}</p>
                      </div>
                    </div>

                    {/* On-screen text */}
                    {scriptResult.on_screen_text?.length > 0 && (
                      <div className="bg-amber-950 rounded-sm px-6 py-5">
                        <p className="text-xs text-amber-400 uppercase tracking-wider font-semibold mb-4">On-screen text</p>
                        <div className="flex flex-wrap gap-2">
                          {scriptResult.on_screen_text.map((t, i) => (
                            <span key={i} className="bg-amber-900 text-amber-100 text-xs px-3 py-1.5 rounded-sm font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Visual directions */}
                    {scriptResult.broll_directions?.length > 0 && (
                      <div className="bg-stone-100 rounded-sm px-6 py-5">
                        <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-4">Visual directions</p>
                        <ul className="space-y-2">
                          {scriptResult.broll_directions.map((d, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                              <span className="text-amber-600 font-bold flex-shrink-0">{i + 1}.</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* ── VIDEO GENERATION ── */}
                    <div className="border border-stone-200 rounded-sm bg-white overflow-hidden">
                      <div className="px-6 py-5 border-b border-stone-100">
                        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Generate video</p>
                        <p className="text-xs text-stone-400">Sends this script to HeyGen and renders a 9:16 Reel with your Elias avatar. Takes 1–3 min.</p>
                      </div>

                      <div className="px-6 py-5">
                        {videoStatus === "idle" && (
                          <button
                            onClick={generateVideo}
                            className="btn-primary w-full py-3 text-sm"
                          >
                            Generate Video with HeyGen
                          </button>
                        )}

                        {videoInProgress && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                              <span className="text-sm text-stone-600">{videoStatusLabel[videoStatus]}</span>
                            </div>
                            <div className="w-full bg-stone-100 rounded-full h-1.5">
                              <div
                                className="bg-amber-600 h-1.5 rounded-full transition-all duration-1000"
                                style={{
                                  width:
                                    videoStatus === "submitting" ? "10%" :
                                    videoStatus === "pending" ? "30%" :
                                    "70%",
                                }}
                              />
                            </div>
                            <p className="text-xs text-stone-400">This window can stay open. Video will appear when ready.</p>
                          </div>
                        )}

                        {videoStatus === "completed" && videoUrl && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                              <span>✓</span>
                              <span>Video ready{videoDuration ? ` · ${Math.round(videoDuration)}s` : ""}</span>
                            </div>
                            {thumbnailUrl && (
                              <div className="relative rounded-sm overflow-hidden border border-stone-200" style={{ aspectRatio: "9/16", maxHeight: 320 }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={thumbnailUrl} alt="Video thumbnail" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-14 h-14 bg-black/50 rounded-full flex items-center justify-center">
                                    <div className="w-0 h-0 border-t-8 border-b-8 border-l-[16px] border-transparent border-l-white ml-1" />
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="flex gap-3">
                              <a
                                href={videoUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary flex-1 py-3 text-center text-sm"
                              >
                                Download Video
                              </a>
                              <button
                                onClick={resetVideo}
                                className="btn-secondary py-3 px-4 text-sm"
                              >
                                Reset
                              </button>
                            </div>
                          </div>
                        )}

                        {videoStatus === "failed" && (
                          <div className="space-y-3">
                            <p className="text-red-600 text-sm">{videoError || "Generation failed."}</p>
                            <button onClick={generateVideo} className="btn-secondary py-2 px-4 text-sm">
                              Try again
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                  </>
                ) : (
                  <div className="bg-white border border-stone-200 rounded-sm min-h-96 flex items-center justify-center">
                    <div className="text-center text-stone-300">
                      <div className="text-5xl mb-4">🎬</div>
                      <p className="text-sm">Script + video generator</p>
                      <p className="text-xs mt-1">Hook · Body · Close · On-screen text · HeyGen video</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* CAPTION OUTPUT */}
            {tab === "caption" && (
              captionResult ? (
                <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
                  <div className="border-b border-stone-100 px-5 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm">🌿</div>
                    <div>
                      <div className="text-xs font-semibold text-stone-800">gut_alchemist</div>
                      <div className="text-xs text-stone-400">The Gut Alchemist</div>
                    </div>
                  </div>
                  <div className="bg-amber-950 aspect-square flex items-center justify-center px-8">
                    <div className="text-center">
                      <div className="text-amber-300 font-serif text-xl leading-snug italic">
                        &ldquo;{captionResult.hook}&rdquo;
                      </div>
                      <div className="text-amber-600 text-xs mt-4 uppercase tracking-widest">gut_alchemist</div>
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-xs text-stone-900 leading-relaxed whitespace-pre-line">{captionResult.caption}</p>
                    <p className="text-xs text-blue-500 mt-3 leading-relaxed">{captionResult.hashtags.join(" ")}</p>
                  </div>
                  <div className="border-t border-stone-100 px-5 py-3 flex items-center justify-between">
                    <span className="text-xs text-stone-400">{captionResult.content_pillar}</span>
                    <button onClick={copyCaption} className="text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors">
                      {copiedCaption ? "Copied." : "Copy caption + tags"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-stone-200 rounded-sm min-h-96 flex items-center justify-center">
                  <div className="text-center text-stone-300">
                    <div className="text-5xl mb-4">🌿</div>
                    <p className="text-sm">Your caption will appear here.</p>
                  </div>
                </div>
              )
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
