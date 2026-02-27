import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    console.log('Proxy GET /api/v1/resources triggered');
    const apiBase = process.env.API_BASE_URL || 'http://localhost:5000';
    const url = new URL(req.url);
    const search = url.searchParams.toString();

    console.log('Fetching session...');
    const session = await auth();
    console.log('Session retrieved:', !!session);

    const headers: HeadersInit = {};
    if (session?.user?.apiToken) {
      headers['Authorization'] = `Bearer ${session.user.apiToken}`;
    }

    const res = await fetch(`${apiBase}/api/v1/resources${search ? `?${search}` : ''}`, {
      headers,
    });

    const body = await res.text();

    return new NextResponse(body, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy GET /api/v1/resources error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch resources via proxy.',
        },
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('Proxy POST /api/v1/resources triggered');
    const apiBase = process.env.API_BASE_URL || 'http://localhost:5000';
    console.log('Fetching session...');
    const session = await auth();
    console.log('Session retrieved:', !!session);

    const headers: HeadersInit = {
      'Content-Type': req.headers.get('content-type') || 'application/json',
    };
    if (session?.user?.apiToken) {
      headers['Authorization'] = `Bearer ${session.user.apiToken}`;
    }

    console.log('Forwarding request to backend...');
    const res = await fetch(`${apiBase}/api/v1/resources`, {
      method: 'POST',
      headers,
      body: req.body,
      // @ts-ignore
      duplex: 'half',
    });

    const responseBody = await res.text();

    return new NextResponse(responseBody, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy POST /api/v1/resources error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to upload resource via proxy.',
        },
      },
      { status: 500 },
    );
  }
}

