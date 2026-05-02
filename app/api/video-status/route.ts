import { NextRequest, NextResponse } from "next/server";

const HEYGEN_BASE = "https://api.heygen.com";

export async function GET(req: NextRequest) {
  const apiKey = process.env.HEYGEN_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "HEYGEN_API_KEY not set" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("video_id");

  if (!videoId) {
    return NextResponse.json({ error: "video_id required" }, { status: 400 });
  }

  const res = await fetch(
    `${HEYGEN_BASE}/v1/video_status.get?video_id=${videoId}`,
    {
      headers: {
        "X-Api-Key": apiKey,
      },
    }
  );

  const data = await res.json();

  if (!res.ok || data.error) {
    return NextResponse.json(
      { error: data.error || "Status check failed" },
      { status: res.status }
    );
  }

  return NextResponse.json({
    status: data.data.status,
    video_url: data.data.video_url || null,
    thumbnail_url: data.data.thumbnail_url || null,
    duration: data.data.duration || null,
  });
}
