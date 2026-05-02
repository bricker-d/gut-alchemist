import { NextRequest, NextResponse } from "next/server";

const HEYGEN_BASE = "https://api.heygen.com";

export async function POST(req: NextRequest) {
  const apiKey = process.env.HEYGEN_API_KEY;
  const defaultAvatarId = process.env.HEYGEN_AVATAR_ID;
  const defaultVoiceId = process.env.HEYGEN_VOICE_ID;

  if (!apiKey) {
    return NextResponse.json({ error: "HEYGEN_API_KEY not set" }, { status: 500 });
  }

  const body = await req.json();
  const { script, avatar_id, voice_id, title } = body;

  if (!script?.trim()) {
    return NextResponse.json({ error: "script is required" }, { status: 400 });
  }

  const avatarId = avatar_id || defaultAvatarId;
  const voiceId = voice_id || defaultVoiceId;

  if (!avatarId) {
    return NextResponse.json(
      { error: "avatar_id required — set HEYGEN_AVATAR_ID in env or pass in request" },
      { status: 400 }
    );
  }

  const payload = {
    video_inputs: [
      {
        character: {
          type: "avatar",
          avatar_id: avatarId,
          avatar_style: "normal",
        },
        voice: {
          type: "text",
          input_text: script,
          ...(voiceId ? { voice_id: voiceId } : {}),
          speed: 0.95,
        },
        background: {
          type: "color",
          value: "#3d2b1f",
        },
      },
    ],
    dimension: {
      width: 1080,
      height: 1920,
    },
    title: title || "Gut Alchemist Reel",
    caption: true,
  };

  const res = await fetch(`${HEYGEN_BASE}/v2/video/generate`, {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    return NextResponse.json(
      { error: data.error || "HeyGen request failed", details: data },
      { status: res.status }
    );
  }

  return NextResponse.json({ video_id: data.data.video_id });
}
