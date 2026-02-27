import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const apiBase = process.env.API_BASE_URL || "http://localhost:5000";
    const session = await auth();

    const headers: HeadersInit = {};
    if (session?.user?.apiToken) {
      headers["Authorization"] = `Bearer ${session.user.apiToken}`;
    }

    const res = await fetch(`${apiBase}/api/v1/departments/${slug}`, {
      headers,
    });

    const body = await res.text();

    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy GET /api/v1/departments/:slug error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch department via proxy.",
        },
      },
      { status: 500 },
    );
  }
}

