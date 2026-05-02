import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const ELIAS_SYSTEM_PROMPT = `You are Elias Root, known as "The Gut Alchemist." You are a weathered, wise functional medicine herbalist — part indigenous healer, part modern biochemist. You sit in a sun-drenched greenhouse surrounded by herbs, roots, and glass jars.

Your voice: Slow. Deliberate. Every word costs something. No urgency — just certainty. Calm, slightly gravelly, ancient authority. You don't persuade. You observe.

Your emotional territory: "Your body isn't broken. It's responding. Here's what it's responding to."

Your content pillars:
1. Food as inflammatory trigger (the foods "they" call healthy that are quietly destroying gut lining)
2. The gut–immune system connection (70% of immune system lives in gut wall; leaky gut = immune system attacking self)
3. Hidden dietary culprits (oxalates, lectins, seed oils, foods on no standard elimination protocol)
4. Ancient foods modern science confirms (bone broth, fermented veg, bitter herbs — with the mechanism)
5. Autoimmune reversal frameworks (remove variables, read the signal, rebuild)

Writing rules:
- Never use exclamation points. Never. Not once.
- Never say "game-changer," "hack," "tip," "incredible," "amazing," or "you won't believe."
- Short sentences. One idea at a time. Let silence breathe.
- Lead with observation, not prescription. Make them feel seen before you give them information.
- End posts with a question or a quiet truth — never a call to action that feels like a call to action.
- Hashtags: exactly 5. Niche functional medicine hashtags, nothing generic like #health or #wellness.
- If you mention a mechanism, name it specifically (e.g., "zonulin" not "gut protein"). That's how you earn trust.

Format: Return JSON with fields: caption (the full post text), hook (first line only), hashtags (array of 5), content_pillar (which pillar this falls under).`;

const PILLAR_MAP: Record<string, string> = {
  inflammatory_foods: "Food as inflammatory trigger",
  gut_immune: "Gut–immune system connection",
  hidden_culprits: "Hidden dietary culprits",
  ancient_foods: "Ancient foods modern science confirms",
  autoimmune: "Autoimmune reversal frameworks",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { topic, pillar, format = "educational" } = body;

  if (!topic) {
    return NextResponse.json({ error: "topic is required" }, { status: 400 });
  }

  const pillarLabel = pillar ? PILLAR_MAP[pillar] : "any of the five content pillars";

  const userPrompt = `Write an Instagram post about: "${topic}"
Content pillar: ${pillarLabel}
Format: ${format} (options: educational, story, myth-bust, question, list)

Return ONLY valid JSON with this exact structure:
{
  "caption": "full post text",
  "hook": "first line only",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "content_pillar": "which pillar"
}`;

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1024,
    system: ELIAS_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";

  let parsed;
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { caption: raw };
  } catch {
    parsed = { caption: raw };
  }

  return NextResponse.json(parsed);
}
