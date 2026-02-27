'use server';

import { ResourceType } from '@/types';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000';

export async function getResources({
  department,
  category,
}: {
  department?: string;
  category?: string;
}) {
  try {
    const session = await auth();
    const headers: HeadersInit = {};
    if (session?.user?.apiToken) {
      headers['Authorization'] = `Bearer ${session.user.apiToken}`;
    }

    const query = new URLSearchParams();
    if (department) query.append('department', department);
    if (category) query.append('category', category);

    const res = await fetch(`${API_BASE}/api/v1/resources?${query.toString()}`, {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch resources: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Failed to fetch resources:', error);
    throw new Error('Failed to fetch resources');
  }
}

export async function uploadResource(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CONTRIBUTOR') {
      return { success: false, error: 'Unauthorized: Only contributors can upload resources.' };
    }

    const apiToken = session.user.apiToken;
    if (!apiToken) {
      return { success: false, error: 'Authentication session error: Token not found. Please log in again.' };
    }

    const res = await fetch(`${API_BASE}/api/v1/resources`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, error: errorData.error?.message || 'Failed to upload resource.' };
    }

    const data = await res.json();
    revalidatePath('/');
    return { success: true, data };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'An unexpected error occurred during upload.' };
  }
}
