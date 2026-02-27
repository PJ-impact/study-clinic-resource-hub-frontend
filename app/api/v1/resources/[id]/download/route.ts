import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const apiBase = process.env.API_BASE_URL || 'http://localhost:5000';
    const session = await auth();

    const headers: HeadersInit = {
      'Content-Type': _req.headers.get('content-type') || 'application/json',
    };
    if (session?.user?.apiToken) {
      headers['Authorization'] = `Bearer ${session.user.apiToken}`;
    }

    const res = await fetch(`${apiBase}/api/v1/resources/${id}/download`, {
      method: 'POST',
      headers,
      body: _req.body,
      // @ts-ignore
      duplex: 'half',
    });

    const body = await res.text();

    return new NextResponse(body, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy POST /api/v1/resources/:id/download error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to process resource download via proxy.',
        },
      },
      { status: 500 },
    );
  }
}
